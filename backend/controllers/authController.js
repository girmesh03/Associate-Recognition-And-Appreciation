import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import RefreshToken from "../models/refreshTokenModel.js";
import CustomError from "../utils/CustomError.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

//@desc     Register new user
//@route    POST /api/auth/signup
//@access   Public
const signup = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, department, position, email, password, role } =
    req.body;

  // Check if user already exists, if yes, throw an error
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new CustomError("User already exists", 409));
  }

  // Create new user
  const user = await User.create({
    firstName,
    lastName,
    department,
    position,
    email,
    password,
    role,
    profilePicture: `${process.env.BASE_URL}/uploads/default/noAvatar.webp`,
    coverPicture: `${process.env.BASE_URL}/uploads/default/noCover.webp`,
  });

  // Generate JWT
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  // Save refresh token
  const savedRefreshToken = await RefreshToken.create({
    token: refreshToken,
    userId: user._id,
    expireAt: new Date(Date.now() + 30000),
  });

  if (!savedRefreshToken) {
    return next(new CustomError("Something went wrong", 500));
  }

  // Send access and refresh token to client, via a cookie
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Prepare response
  const { password: pwd, __v, ...others } = user._doc;

  // Send response
  res.status(201).json(others);
});

//@desc     Login user
//@route    POST /api/auth/login
//@access   Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new CustomError("Please provide an email and password", 400));
  }

  // Check if user exists, if not, throw an error
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new CustomError("No account found. Please sign up.", 404));
  } else if (!(await user.matchPassword(password))) {
    return next(new CustomError("Invalid email or password", 403));
  }

  // Generate JWT
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  // Save refresh token
  const updatedToken = await RefreshToken.findOneAndUpdate(
    { userId: user._id },
    {
      token: refreshToken,
      expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    { new: true, upsert: true }
  );

  // If there is an error updating the refresh token, return an error
  if (!updatedToken) {
    return next(new CustomError("Error updating refresh token.", 500));
  }

  // Send access and refresh token to client, via a cookie
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Prepare response
  const { password: pwd, __v, ...others } = user._doc;

  // Send response
  res.status(200).json(others);
});

//@desc     Logout user
//@route    DELETE /api/auth/logout
//@access   public
const logout = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refresh_token;

  // If there is refresh token update it
  if (refreshToken) {
    await RefreshToken.findOneAndDelete({ token: refreshToken });
  }

  // Clear the access and refresh token cookie, return an empty response
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.sendStatus(204);
});

//@desc     Refresh access token
//@route    GET /api/auth/refresh
//@access   public
const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken) {
    // console.log("No refresh token provided");
    return next(new CustomError("Unauthorized, Please login", 403));
  }

  const validToken = await RefreshToken.findOne({ token: refreshToken });

  if (!validToken) {
    // console.log("No refresh token found");
    return next(new CustomError("Unauthorized, Please login", 403));
  }

  const user = await User.findById(validToken.userId);
  if (!user) {
    // console.log("User not found for refresh token");
    return next(new CustomError("Unauthorized, Please login", 403));
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      // console.error("Refresh token verification error:", err);
      return next(new CustomError("Unauthorized, Please login", 403));
    }

    const accessToken = generateAccessToken(decoded.id, decoded.role);
    // Send access and refresh token to client, via a cookie
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Access token refreshed successfully" });
  });
});

export { signup, login, logout, refreshAccessToken };
