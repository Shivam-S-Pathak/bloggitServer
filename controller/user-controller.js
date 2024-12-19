import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Token from "../model/token.js";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

export const SignUser = async (request, response) => {
  try {
    const hashedPassword = await bcrypt.hash(request.body.password, 10);
    const user = {
      username: request.body.username,
      email: request.body.email,
      password: hashedPassword,
    };
    const newUser = new User(user);
    await newUser.save();
    return response.status(200).json({ msg: "signup successfull" });
  } catch (error) {
    return response.status(500).json({ msg: "Error while sign up" });
  }
};

export const LogUser = async (request, response) => {
  try {
    let user = await User.findOne({
      $or: [
        { username: request.body.username },
        { email: request.body.username },
      ],
    });

    if (!user) {
      return response.status(400).json({ msg: "Username does not match" });
    }

    let match = await bcrypt.compare(request.body.password, user.password);

    if (match) {
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_SECRET_KEY,
        { expiresIn: "15m" }
      );

      // const refreshToken = jwt.sign(
      //   { id: user._id },
      //   process.env.REFRESH_SECRET_KEY
      // );

      // const newToken = new Token({ token: refreshToken });
      // await newToken.save();

      return response.status(200).json({
        accessToken: accessToken,
        // refreshToken: refreshToken,
        name: user.username,
        email: user.email,
      });
    } else {
      return response.status(400).json({ msg: "Password doesn't match" });
    }
  } catch (error) {
    console.error("Error while logging in:", error);
    return response.status(500).json({ msg: "Error while logging in" });
  }
};

export const validateEmail = async (request, response) => {
  const { email } = request.body;

  try {
    let result = await User.findOne({ email: email });
    if (!result) {
      return response.status(201).json("email is not registered");
    }
    return response.status(200).json({ msg: "this is a valid email" });
  } catch (error) {
    return response.status(500).json({ msg: "something went wrong" });
  }
};

export const mailSender = async (request, response) => {
  const { email, otp } = request.body;

  // HTML Template
  const emailTemplate = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Recovery</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: black;
        margin: 0;
        padding: 0;
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
      }
      .logo-icon {
        font-size: 40px;
        color: rgb(155, 8, 217);
        margin-right: 8px;
      }
      .logo-text {
        font-weight: 700;
        letter-spacing: 0.3rem;

        margin: 20px 0;
        padding: 10px 20px;
        background-color: rgb(155, 8, 217);
        color: white;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        border-radius: 4px;
        font-family: monospace;
      }
      .otp-box {
        
       
        color: rgb(155, 8, 217);
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        border-radius: 4px;
      }
      .footer {
        margin-top: 20px;
        font-size: 12px;
        color: gray;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img
         src="cid:logo"
          alt="BloggIT Logo"
          style="width: 200px"
        />
      </div>
      <!-- Main Content -->
      <h2 style="text-align: center">Password Recovery Request</h2>
      <p>Greetings from BloggIT,</p>
      <p>
        You recently requested to reset your password for your BloggIT account.
        Please use the following one-time password (OTP) to reset it:
      </p>

      <!-- OTP Box -->
      <div class="logo">
        <div class="otp-box">${otp}</div>
      </div>

      <p>If you didn’t request this, you can safely ignore this email.</p>
      <p>Regards, <br />The BloggIT Team</p>

      <!-- Footer -->
      <div class="footer">
        <p>Need assistance? <a href="mailto:${
          process.env.EMAIL_ADMIN
        }">Contact us</a></p>
        <p>© ${new Date().getFullYear()} BloggIT. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`;

  try {
    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"BloggIT Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Recovery OTP",
      html: emailTemplate,
      attachments: [
        {
          filename: "image.png",
          path: path.resolve(__dirname, "../image.png"),
          cid: "logo",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);

    return response
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.log("Error sending email:", error);
    return response.status(500).json({ error });
  }
};

export const setNewPass = async (request, response) => {
  const { email, pass } = request.body;
  console.log("this is form the server side ", email, pass);

  try {
    const hashedPassword = await bcrypt.hash(pass, 10);

    const result = await User.findOne({ email: email });

    if (result) {
      result.password = hashedPassword;
      await result.save();

      return response
        .status(200)
        .json({ msg: "password updated successfully" });
    } else {
      return response.status(404).json({
        success: false,
        message: "User with the provided email does not exist.",
      });
    }
  } catch (error) {
    console.error("Error updating password:", error);

    return response.status(500).json({
      success: false,
      message: "An internal server error occurred while updating the password.",
    });
  }
};

export const sendFeedback = async (req, res) => {
  const { feedback, email } = req.body;

  if (!feedback || !email) {
    return res
      .status(400)
      .json({ message: "Feedback and email are required." });
  }
  const emailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thank You for Your Feedback</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      padding: 20px;
      background-color: #ffffff;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header img {
      width: 150px;
    }
    h2 {
      text-align: center;
      color: #4caf50;
    }
    p {
      margin: 15px 0;
      color: #555;
    }
    .thank-you-message {
      margin: 20px 0;
      padding: 15px;
      background-color: #e8f5e9;
      color: #4caf50;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #777;
      text-align: center;
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }
    .footer a {
      color: #4caf50;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img
        src="cid:logo"
        alt="BloggIT Logo"
      />
    </div>
    <!-- Main Content -->
    <h2>Thank You for Your Feedback!</h2>
    <p>Dear User,</p>
    <p>
      We sincerely appreciate you taking the time to provide us with your valuable feedback. Your thoughts and suggestions are incredibly important to us as we strive to make BloggIT better for everyone.
    </p>
    <div class="thank-you-message">
      Your feedback helps us grow and improve!
    </div>
    <p>If you have any further suggestions or questions, feel free to reach out to us at any time.</p>
    <p>Thank you once again for supporting BloggIT!</p>
    <p>Warm regards, <br />The BloggIT Team</p>
    <!-- Footer -->
    <div class="footer">
      <p>Need assistance? <a href="mailto:${
        process.env.EMAIL_ADMIN
      }">Contact us</a></p>
      <p>&copy; ${new Date().getFullYear()} BloggIT. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email to the user
    const userMailOptions = {
      from: `"BloggIT Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank You for Your Feedback!",
      html: emailTemplate,
      attachments: [
        {
          filename: "image.png",
          path: path.resolve(__dirname, "../image.png"),
          cid: "logo",
        },
      ],
    };

    const adminMailOptions = {
      from: `"BloggIT Support" <${process.env.EMAIL_USER}>`,
      to: `${process.env.EMAIL_ADMIN}`, // Admin email
      subject: "New Feedback Received",
      text: `You have received new feedback from a user.

User Email: ${email}
Feedback: ${feedback}

Best regards,
Feedback System`,
    };

    // Send both emails
    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);

    return res
      .status(200)
      .json({ message: "Feedback submitted and emails sent successfully." });
  } catch (error) {
    console.error("Error sending emails:", error);
    return res.status(500).json({ message: "Failed to send emails.", error });
  }
};
