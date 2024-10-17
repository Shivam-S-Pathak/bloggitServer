import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Token from "../model/token.js";

dotenv.config();

const SignUser = async (request, response) => {
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
    // Find user by username
    let user = await User.findOne({ username: request.body.username });

    // If the user is not found, return an error response
    if (!user) {
      return response.status(400).json({ msg: "Username does not match" });
    }

    // Compare the provided password with the stored hashed password
    let match = await bcrypt.compare(request.body.password, user.password);

    // If password matches, generate access and refresh tokens
    if (match) {
      const accessToken = jwt.sign(
        { id: user._id }, // Sign token with user id (or other unique identifier)
        process.env.ACCESS_SECRET_KEY,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { id: user._id }, // Sign token with user id (or other unique identifier)
        process.env.REFRESH_SECRET_KEY
      );

      // Save the refresh token to the database
      const newToken = new Token({ token: refreshToken });
      await newToken.save();

      // Respond with tokens and user info
      return response.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        name: user.username,
        email: user.email,
      });
    } else {
      // If password does not match, return an error response
      return response.status(400).json({ msg: "Password doesn't match" });
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error while logging in:", error);
    return response.status(500).json({ msg: "Error while logging in" });
  }
};

export default SignUser;
