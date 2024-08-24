import asyncHandler from "express-async-handler";

const signup = asyncHandler(async (req, res, next) => {
  res.status(201).json({ message: "signup" });
});

const login = asyncHandler(async (req, res, next) => {
  res.status(200).json({ message: "login" });
});

export { signup, login };
