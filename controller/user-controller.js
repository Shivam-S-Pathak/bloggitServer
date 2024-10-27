import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Token from "../model/token.js";

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
    let user = await User.findOne({ username: request.body.username });

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
