import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import CustomError from "../utils/CustomError.js";

//@desc     Register new user
//@route    POST /api/auth/signup
//@access   Public
const signup = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, department, position, email, password } =
    req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new CustomError("User already exists", 400);
    return next(error);
  }

  const user = await User.create({
    firstName,
    lastName,
    department,
    position,
    email,
    password,
  });

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const { password: pwd, __v, ...others } = user._doc;

  res.status(201).json(others);
});

//@desc     Login user
//@route    POST /api/auth/login
//@access   Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const error = new CustomError("You don't have an account, sign up", 401);
    return next(error);
  } else if (user && !(await user.matchPassword(password))) {
    const error = new CustomError("Invalid email or password", 401);
    return next(error);
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const { password: pwd, __v, ...others } = user._doc;

  res.status(200).json(others);
});

//@desc     Logout user
//@route    GET /api/auth/logout
//@access   Public
const logout = asyncHandler(async (req, res, next) => {
  // TODO: Add a better message upon error
  res
    .clearCookie("access_token")
    .clearCookie("refresh_token")
    .status(200)
    .json({ message: "User logged out" });
});

export { signup, login, logout };
