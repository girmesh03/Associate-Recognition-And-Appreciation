import asyncHandler from "express-async-handler";
import Recognition from "../models/recognitionModel.js";

//@desc     Get all recognitions
//@route    GET /api/recognitions
//@access   Private
const getAllRecognitions = asyncHandler(async (req, res) => {
  const recognitions = await Recognition.find().sort({ createdAt: -1 });
  res.status(200).json(recognitions);
});

export { getAllRecognitions };
