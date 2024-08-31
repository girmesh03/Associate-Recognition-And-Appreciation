import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

//@desc     Get all user
//@route    GET /api/users
//@access   Private
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json(users);
});

export { getAllUsers };
