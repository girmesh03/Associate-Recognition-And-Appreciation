import asyncHandler from "express-async-handler";
import Nominations from "../models/nominationModel.js";
import User from "../models/userModel.js";
import CustomError from "../utils/CustomError.js";
import Comment from "../models/commentModel.js";
import anonymizeSender from "../utils/anonymizeSender.js";
import convertRating from "../utils/convertRating.js";

//@desc     Create a new Nomination
//@route    POST /api/nominations
//@access   Private
const createNomination = asyncHandler(async (req, res, next) => {
  const {
    nominator: nominatorId,
    nominee: nomineeId,
    category,
    reason,
    rating,
    isAnonymous,
    date,
  } = req.body;

  // Find the nominator and nominee users
  const [nominator, nominee] = await Promise.all([
    User.findById(nominatorId),
    User.findById(nomineeId),
  ]);

  // Check if both users exist
  if (!nominator || !nominee) {
    return next(new CustomError("nominator or nominee not found", 404));
  }

  // Ensure the nominator and nominee are not the same
  if (nominator._id.equals(nominee._id)) {
    return next(new CustomError("Cannot nominate yourself", 400));
  }

  // Validate rating
  if (isNaN(rating) || rating < 1 || rating > 100) {
    return next(
      new CustomError("Rating must be a number between 1 and 100", 400)
    );
  }

  // Convert the rating from 1-100 scale to 3-5 scale
  const convertedRating = Math.round(convertRating(rating) * 10) / 10;

  // Update nominee nomination count
  const updatednominee = await User.findByIdAndUpdate(
    nominee._id,
    { $inc: { "nominations.count": 1 } },
    { new: true }
  );

  // Create a new nomination
  const newNomination = await Nominations.create({
    nominator: nominator._id,
    nominee: updatednominee._id,
    category,
    reason,
    rating: convertedRating,
    isAnonymous,
    date,
  });

  // Populate nominator and nominee
  const response = await Nominations.findById(newNomination._id).populate(
    "nominator nominee"
  );

  // Return the nomination
  res.status(201).json(response);
});

//@desc     Get all Nominations
//@route    GET /api/nominations
//@access   Private
const getAllNominations = asyncHandler(async (req, res, next) => {
  const userRole = req.user.role;
  const userId = req.user.id;

  // Fetch all nominations and populate nominator and nominee fields
  const nominations = await Nominations.find({})
    .sort({ createdAt: -1 })
    .populate("nominator nominee");

  // Map over the nominations to handle anonymity
  const response = nominations.map((nomination) => {
    return {
      ...nomination.toObject(),
      nominator: anonymizeSender(
        nomination,
        userId,
        userRole,
        "nominator",
        "nominee"
      ),
    };
  });

  // Return the list of nominations
  res.status(200).json(response);
});

//@desc     Get a single nomination
//@route    GET /api/nominations/:nominationId
//@access   Private
const getNomination = asyncHandler(async (req, res, next) => {
  const { nominationId } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  // Find the nomination by ID and populate nominator and nominee fields
  const nomination = await Nominations.findById(nominationId).populate(
    "nominator nominee"
  );

  // If the nomination is not found
  if (!nomination) {
    return next(new CustomError("Nomination not found", 404));
  }

  // Handle anonymity for nominator
  const response = {
    ...nomination.toObject(),
    nominator: anonymizeSender(
      nomination,
      userId,
      userRole,
      "nominator",
      "nominee"
    ),
  };

  // Return the nomination
  res.status(200).json(response);
});

//@desc     Delete a nomination
//@route    DELETE /api/nominations/:nominationId
//@access   Private
const deleteNomination = asyncHandler(async (req, res, next) => {
  const { nominationId } = req.params;

  try {
    // Find the nomination
    const nomination = await Nominations.findById(nominationId);

    // Check if the nomination exists
    if (!nomination) {
      return next(new CustomError("Nomination not found", 404));
    }

    // Fetch the nominator and nominee
    const [nominator, nominee] = await Promise.all([
      User.findById(nomination.nominator),
      User.findById(nomination.nominee),
    ]);

    // Check if both users exist
    if (!nominator || !nominee) {
      return next(new CustomError("Nominator or nominee not found", 404));
    }

    // Deduct nominee nomination count, if positive
    await User.findByIdAndUpdate(
      nominee._id,
      { $inc: { "nominations.count": nominee.nominations.count > 0 ? -1 : 0 } },
      { new: true }
    );

    // Delete the nomination
    const deletedNomination = await Nominations.findByIdAndDelete(nominationId);

    // Delete associated comments
    await Comment.deleteMany({ postId: deletedNomination._id });

    // Send a successful response, with no content
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting nomination:", error);
    next(error);
  }
});

//@desc     Update a nomination
//@route    PUT /api/nominations/:nominationId
//@access   Private
const updateNomination = asyncHandler(async (req, res, next) => {
  const { nominationId } = req.params;
  const {
    nominator: nominatorId,
    nominee: nomineeId,
    category,
    reason,
    rating,
    isAnonymous,
    date,
  } = req.body;

  try {
    // Find the nomination
    const nomination = await Nominations.findById(nominationId);
    if (!nomination) {
      return next(new CustomError("Nomination not found", 404));
    }

    // Validate rating
    if (isNaN(rating) || rating < 1 || rating > 100) {
      return next(
        new CustomError("Rating must be a number between 1 and 100", 400)
      );
    }

    // Convert the rating from 1-100 scale to 3-5 scale
    let convertedRating = nomination.rating;
    if (rating !== nomination.rating) {
      convertedRating = Math.round(convertRating(rating) * 10) / 10;
    }

    // Find the nominator and nominee
    const [nominator, nominee] = await Promise.all([
      User.findById(nominatorId),
      User.findById(nomineeId),
    ]);

    if (!nominator || !nominee) {
      return next(new CustomError("Nominator or nominee not found", 404));
    }

    // Update the nomination
    const updatedNomination = await Nominations.findByIdAndUpdate(
      nominationId,
      {
        nominator: nominator._id,
        nominee: nominee._id,
        category,
        reason,
        rating: convertedRating,
        isAnonymous,
        date,
      },
      { new: true, runValidators: true }
    );

    // Send the updated nomination
    res.status(200).json(updatedNomination);
  } catch (error) {
    next(error);
  }
});

// @desc     Add or remove nomination vote
// @route    PUT /api/nominations/:nominationId/vote
// @access   Private
const addRemoveVote = asyncHandler(async (req, res, next) => {
  const { nominationId } = req.params;
  const userId = req.user.id;

  try {
    // Find the nomination by its ID
    const nomination = await Nominations.findById(nominationId).populate(
      "nominator nominee"
    );

    // If the nomination is not found
    if (!nomination) {
      return next(new CustomError("Nomination not found", 404));
    }

    // Check if the user has already voted
    const hasVoted = nomination.votes.includes(userId);

    if (hasVoted) {
      // If user has already voted, remove their vote
      nomination.votes = nomination.votes.filter(
        (vote) => vote.toString() !== userId.toString()
      );
    } else {
      // If user has not voted, add their vote
      nomination.votes.push(userId);
    }

    // Save the updated nomination
    await nomination.save();

    // Return the updated nomination with the new vote count
    res.status(200).json(nomination);
  } catch (error) {
    next(error);
  }
});

//@desc     Add or remove a like from a nomination
//@route    PUT /api/nominations/:nominationId/like
//@access   Private
const addRemoveLike = asyncHandler(async (req, res, next) => {
  const { nominationId } = req.params;
  const userId = req.user.id;

  // Find the nomination and populate nominator and nominee
  const nomination = await Nominations.findById(nominationId).populate(
    "nominator nominee"
  );

  if (!nomination) {
    return next(new CustomError("Nomination not found", 404));
  }

  // Check if user already liked the nomination
  if (nomination.likes.some((like) => like.toString() === userId)) {
    // If user has liked, remove the like
    nomination.likes = nomination.likes.filter(
      (like) => like.toString() !== userId
    );
  } else {
    // If user has not liked, add the like
    nomination.likes.push(userId);
  }

  // Save the updated nomination document
  await nomination.save();

  // Return the updated nomination with populated fields
  res.status(200).json(nomination);
});

//@desc     Add or remove a bookmark from a nomination
//@route    PUT /api/nominations/:nominationId/bookmark
//@access   Private
const addRemoveBookmark = asyncHandler(async (req, res, next) => {
  const { nominationId } = req.params;
  const userId = req.user.id;

  // Find the nomination by ID
  const nomination = await Nominations.findById(nominationId).populate(
    "nominator nominee"
  );

  if (!nomination) {
    return next(new CustomError("Nomination not found", 404));
  }

  // Check if the user has already bookmarked this nomination
  if (nomination.savedBy.some((savedUser) => savedUser.toString() === userId)) {
    // If the user has bookmarked, remove the bookmark
    nomination.savedBy = nomination.savedBy.filter(
      (savedUser) => savedUser.toString() !== userId
    );
  } else {
    // If the user hasn't bookmarked, add the bookmark
    nomination.savedBy.push(userId);
  }

  // Save the nomination document with updated bookmarks
  await nomination.save();

  // Return the updated nomination with populated fields
  res.status(200).json(nomination);
});

//@desc     Get all bookmarks for the authenticated user
//@route    GET /api/nominations/:userId/bookmarks
//@access   Private
const getUserBookmarks = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  // Find all nominations bookmarked by the user
  const bookmarks = await Nominations.find({ savedBy: userId }).populate(
    "nominator nominee"
  );

  // If no bookmarks are found, return an error
  if (!bookmarks) {
    return next(
      new CustomError("You haven't bookmarked any nominations yet", 404)
    );
  }

  // Return the bookmarks
  res.status(200).json(bookmarks);
});

export {
  createNomination,
  getAllNominations,
  getNomination,
  deleteNomination,
  updateNomination,
  addRemoveVote,
  addRemoveLike,
  addRemoveBookmark,
  getUserBookmarks,
};
