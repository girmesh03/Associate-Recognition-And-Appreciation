import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import RefreshToken from "../models/refreshTokenModel.js";
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
    return next(new CustomError("User already exists", 409));
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

  await RefreshToken.create({ token: refreshToken, userId: user._id });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const { password: pwd, __v, ...others } = user._doc;

  res.status(201).json({ accessToken, user: others });
});

//@desc     Login user
//@route    POST /api/auth/login
//@access   Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new CustomError("No account found. Please sign up.", 404));
  } else if (!(await user.matchPassword(password))) {
    return next(new CustomError("Invalid email or password", 401));
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  await RefreshToken.create({ token: refreshToken, userId: user._id });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const { password: pwd, __v, ...others } = user._doc;

  res.status(200).json({ accessToken, user: others });
});

//@desc     Logout user
//@route    POST /api/auth/logout
//@access   Public
const logout = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refresh_token;

  if (refreshToken) {
    // Remove refresh token from the database
    await RefreshToken.deleteOne({ token: refreshToken });
    res.clearCookie("refresh_token");
  }

  res.sendStatus(204);
});

//@desc     Refresh access token
//@route    POST /api/auth/refresh
//@access   Public
const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken) {
    return next(new CustomError("Authentication required", 401));
  }

  const validToken = await RefreshToken.findOne({ token: refreshToken });

  if (!validToken) {
    return next(new CustomError("Authentication required", 401));
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, decoded) => {
      if (err) {
        return next(new CustomError("Authentication required", 401));
      }
      const accessToken = generateAccessToken(decoded.id, decoded.role);

      res.status(200).json({ accessToken });
    }
  );
});

export { signup, login, logout, refreshAccessToken };
