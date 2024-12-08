import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

export const sendOtp = async (request, response) => {
  const { email, otp } = request.body;

  // HTML Template
  const emailTemplate = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to BloggIT</title>
    <style>
      body {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f5f7;
        color: #333;
      }

      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .header {
        background-color: #5c67f2;
        color: #ffffff;
        text-align: center;
        padding: 40px 20px;
      }

      .header h1 {
        margin: 0;
        font-size: 26px;
        font-weight: 700;
      }

      .content {
        padding: 30px 20px;
      }

      .content h2 {
        font-size: 22px;
        margin-bottom: 10px;
        color: #5c67f2;
      }

      .content p {
        font-size: 16px;
        margin: 10px 0;
        line-height: 1.6;
      }

      .otp-box {
        margin: 20px 0;
        padding: 15px 20px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        color: #5c67f2;
        border: 1px dashed #5c67f2;
        border-radius: 8px;
        background-color: #f9f9ff;
      }

      .button {
        display: inline-block;
        margin-top: 20px;
        background-color: #5c67f2;
        color: #ffffff;
        text-decoration: none;
        font-size: 16px;
        font-weight: bold;
        padding: 12px 20px;
        border-radius: 6px;
        text-align: center;
      }

      .footer {
        text-align: center;
        padding: 20px;
        font-size: 14px;
        background-color: #f4f5f7;
        color: #777;
        border-top: 1px solid #ddd;
      }

      .footer a {
        color: #5c67f2;
        text-decoration: none;
      }

      .logo {
        display: block;
        margin: 20px auto;
        width: 150px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>Welcome to BloggIT!</h1>
        <p>Your hub for stories, ideas, and connections.</p>
      </div>

      <!-- Logo -->
      <img class="logo" src="cid:logo" alt="BloggIT Logo" />

      <div class="content">
        <h2>Hello, and welcome aboard!</h2>
        <p>
          We're so excited to have you join our creative community. BloggIT is
          designed to help you share your stories, connect with readers, and
          explore amazing content from people just like you.
        </p>
        <p>
          To get started, please use the following one-time password (OTP) for
          verification:
        </p>

        <div class="otp-box">${otp}</div>

        <p>
          Once verified, you'll have full access to all BloggIT features.
          Whether you're here to write, read, or connect, the possibilities are
          endless.
        </p>
      </div>

      <div class="footer">
        <p>
          Need help?
          <a href="mailto:shivampathak2100@gmail.com">Contact Support</a>
        </p>
        <p>&copy; ${new Date().getFullYear()} BloggIT. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;

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
      subject: "Welcome to Bloggit , verify for account",
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
