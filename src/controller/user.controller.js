import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    // Todo : hash password first
    const hashPassword = bcrypt.hash(password, 10);
    console.log("hashPassword", hashPassword);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    if (!user) {
      return res.status(500).json({ message: "Failed to create User" });
    }

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ email });

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "User details are incorrect" });
    // return
  }

  const payload = {
    _id: user._id,
    email: user.email,
    role: "user",
  };
  // Sign the token with a secret key and set an expiration time
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.status(200).cookie().json({ message: "Login successful", token });
};
