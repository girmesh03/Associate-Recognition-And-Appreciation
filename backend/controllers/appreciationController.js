import asyncHandler from "express-async-handler";
import Appreciation from "../models/appreciationModel.js";

//@desc     Get all Appreciations
//@route    GET /api/Appreciations
//@access   Private
const getAllAppreciations = asyncHandler(async (req, res) => {
  const appreciations = await Appreciation.find().sort({ createdAt: -1 });
  res.status(200).json(appreciations);
});

export { getAllAppreciations };
