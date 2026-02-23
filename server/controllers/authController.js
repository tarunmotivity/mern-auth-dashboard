import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";


export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name && !email && !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  if (!name) {
    res.status(400);
    throw new Error("Username Required");
  }

  if (!email) {
    res.status(400);
    throw new Error("Email Required");
  }

  if (!password) {
    res.status(400);
    throw new Error("Password Required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

 
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
  success: true,
  message: "Login successful",
  data: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  },
});

});
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.json({
    success: true,
    data: users
  });
});

