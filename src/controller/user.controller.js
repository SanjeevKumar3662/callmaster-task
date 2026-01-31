import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/utils.js";
// import jwt from "jsonwebtoken";

// export const registerUser = async (req, res) => {};
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6 || password.length > 72) {
      return res
        .status(400)
        .json({ message: "Password must be between 6 and 72 characters" });
    }

    const duplicateUser = await User.findOne({ email });

    if (duplicateUser) {
      return res.status(400).json({ message: "User is already registered" });
    }

    // Todo : hash password first
    const hashPassword = await bcrypt.hash(password, 10);
    // console.log("hashPassword", hashPassword);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    if (!user) {
      return res.status(500).json({ message: "Failed to create User" });
    }

    // return res.status(201).json({});

    const payload = {
      _id: user._id,
      email: user.email,
      role: "user",
    };
    // Sign the token with a secret key and set an expiration time
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .cookie("accessToken", token, {
        httpOnly: true, // Prevents client-side JavaScript from reading the cookie
        secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
        maxAge: 3600000, // Cookie expiration time (1 hour in milliseconds)
      })
      .json({ message: "Registered successfully", ...payload });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    // console.log("user found : ", user);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "User details are incorrect" });
    }

    const payload = {
      _id: user._id,
      email: user.email,
      role: "user",
    };

    generateToken(payload, res);

    return res.status(200).json({ message: "Login successful", ...payload });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
