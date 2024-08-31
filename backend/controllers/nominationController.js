import asyncHandler from "express-async-handler";
import Nomination from "../models/nominationModel.js";

//@desc     Get all Nominations
//@route    GET /api/Nominations
//@access   Private
const getAllNominations = asyncHandler(async (req, res) => {
  const nominations = await Nomination.find().sort({ createdAt: -1 });
  res.status(200).json(nominations);
});

export { getAllNominations };
