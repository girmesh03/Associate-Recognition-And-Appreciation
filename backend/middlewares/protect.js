import jwt from "jsonwebtoken";
import util from "util";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import CustomError from "../utils/CustomError.js";

const protect = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies?.access_token;

  if (!accessToken) {
    // console.log("No access token provided");
    return next(new CustomError("No access token provided", 401));
  }

  try {
    // console.log("Verifying token:", token);
    const decoded = await util.promisify(jwt.verify)(
      accessToken,
      process.env.JWT_ACCESS_SECRET
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      // console.log("User not found");
      return next(new CustomError("User not found", 401));
    }

    req.user = decoded;
    next();
  } catch (error) {
    // console.error("Token verification error:", error);
    return next(new CustomError("Invalid access token", 401));
  }
});

export default protect;
