import asyncHandler from "express-async-handler";
import Recognition from "../models/recognitionModel.js";
import User from "../models/userModel.js";
import CustomError from "../utils/CustomError.js";
import { deleteAttachments } from "../utils/fileUtils.js";
import anonymizeSender from "../utils/anonymizeSender.js";

// @desc     Create a new recognition
// @route    POST /api/recognitions
// @access   Private
const createRecognition = asyncHandler(async (req, res, next) => {
  // Destructure request body to extract relevant fields
  const { sender, receiver, category, reason, pointsAwarded, isAnonymous } =
    req.body;

  // Initialize an array for file uploads and
  let fileUploads = [];

  // Map over the uploaded files
  if (req.files && req.files.attachments) {
    fileUploads = req.files.attachments.map((file) => ({
      filename: file.filename,
      path: `${process.env.BASE_URL}/uploads/${
        file.mimetype.startsWith("image/") ? "images" : "videos"
      }/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
      fileType: file.mimetype.startsWith("image/") ? "image" : "video",
    }));
  }

  try {
    // Retrieve sender and receiver user information from the database
    const [senderUser, receiverUser] = await Promise.all([
      User.findById(sender),
      User.findById(receiver),
    ]);

    // Check if both users exist
    if (!senderUser || !receiverUser) {
      const whichOne = senderUser
        ? "Receiver is"
        : receiverUser
        ? "Sender is"
        : "Sender and receiver are";
      deleteAttachments(fileUploads);
      return next(new CustomError(`${whichOne} not found`, 404));
    }

    // Ensure the sender and receiver are not the same
    if (senderUser._id.equals(receiverUser._id)) {
      deleteAttachments(fileUploads);
      return next(new CustomError("Cannot recognize yourself", 400));
    }

    // Validate pointsAwarded
    if (isNaN(pointsAwarded)) {
      deleteAttachments(fileUploads);
      return next(new CustomError("Points awarded must be a number", 400));
    }

    // Deduct points from the sender and increment sent recognitions count
    const [updatedSender, updatedReceiver] = await Promise.all([
      User.findByIdAndUpdate(senderUser._id, {
        $inc: {
          "points.sent": pointsAwarded,
          "recognitions.sent": 1,
        },
      }),
      User.findByIdAndUpdate(receiverUser._id, {
        $inc: {
          "points.received": pointsAwarded,
          "recognitions.received": 1,
        },
      }),
    ]);

    if (!updatedSender || !updatedReceiver) {
      deleteAttachments(fileUploads);
      return next(new CustomError("Unable to deduct user points", 404));
    }

    // Create a new recognition document in the database
    const newRecognition = await Recognition.create({
      sender: updatedSender._id,
      receiver: updatedReceiver._id,
      category,
      reason,
      pointsAwarded,
      isAnonymous,
      attachments: fileUploads,
    });

    // Retrieve the newly created recognition with populated sender and receiver data
    const response = await Recognition.findById(newRecognition._id).populate(
      "sender receiver"
    );

    // Send a successful response with the created recognition
    res.status(201).json(response);
  } catch (error) {
    // Handle errors and delete any uploaded attachments if an error occurs
    deleteAttachments(fileUploads);
    next(error);
  }
});

// @desc     Get all recognitions
// @route    GET /api/recognitions
// @access   Private
const getAllRecognitions = asyncHandler(async (req, res, next) => {
  const userRole = req.user.role;
  const userId = req.user.id;

  // Fetch all recognitions and populate sender and receiver fields
  const recognitions = await Recognition.find({})
    .sort({ createdAt: -1 })
    .populate("sender receiver");

  // Map over the recognitions to handle anonymity
  const response = recognitions.map((recognition) => {
    return {
      ...recognition.toObject(),
      sender: anonymizeSender(recognition, userId, userRole),
    };
  });

  // Return the list of recognitions
  res.status(200).json(response);
});

//@desc     Get a single recognition by ID
//@route    GET /api/recognitions/:recognitionId
//@access   Private
const getRecognition = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const { recognitionId } = req.params;

  // Find the recognition by ID, populating both sender and receiver
  const recognition = await Recognition.findById(recognitionId).populate(
    "sender receiver"
  );

  // If the recognition is not found
  if (!recognition) {
    return next(new CustomError("Recognition not found", 404));
  }

  // Handle anonymity for sender
  const response = {
    ...recognition.toObject(),
    sender: anonymizeSender(recognition, userId, userRole),
  };

  // Return the recognition
  res.status(200).json(response);
});

// @desc     Delete a recognition
// @route    DELETE /api/recognitions/:recognitionId
// @access   Private
const deleteRecognition = asyncHandler(async (req, res, next) => {
  const { recognitionId } = req.params;

  try {
    // Find the recognition
    const recognition = await Recognition.findById(recognitionId);

    // Check if the recognition exists
    // TODO: This checked by ownershipOrAdmin middleware, needs improvement
    if (!recognition) {
      return next(new CustomError("Recognition not found", 404));
    }

    // Fetch the sender and receiver
    const [sender, receiver] = await Promise.all([
      User.findById(recognition.sender),
      User.findById(recognition.receiver),
    ]);

    // Check if both users exist
    if (!sender || !receiver) {
      return next(new CustomError("Sender or receiver not found", 404));
    }

    // Fetch current points and recognition counts for both sender and receiver
    const senderPoints = sender.points.sent;
    const senderRecognitionsSent = sender.recognitions.sent;

    const receiverPoints = receiver.points.received;
    const receiverRecognitionsReceived = receiver.recognitions.received;

    // Calculate new points and recognitions ensuring they don't go below zero
    const newSenderPoints = Math.max(
      senderPoints - recognition.pointsAwarded,
      0
    );
    const newSenderRecognitionsSent = Math.max(senderRecognitionsSent - 1, 0);

    const newReceiverPoints = Math.max(
      receiverPoints - recognition.pointsAwarded,
      0
    );
    const newReceiverRecognitionsReceived = Math.max(
      receiverRecognitionsReceived - 1,
      0
    );

    // Update users' points and recognition counts
    await Promise.all([
      User.findByIdAndUpdate(
        sender._id,
        {
          $set: {
            "points.sent": newSenderPoints,
            "recognitions.sent": newSenderRecognitionsSent,
          },
        },
        { new: true }
      ),
      User.findByIdAndUpdate(
        receiver._id,
        {
          $set: {
            "points.received": newReceiverPoints,
            "recognitions.received": newReceiverRecognitionsReceived,
          },
        },
        { new: true }
      ),
    ]);

    // Delete the recognition
    const deletedRecognition = await Recognition.findByIdAndDelete(
      recognitionId
    );

    // Delete associated comments
    if (deletedRecognition.comments.length > 0) {
      await Comment.deleteMany({ postId: deletedRecognition._id });
    }

    // Delete associated attachments
    if (deletedRecognition) {
      deleteAttachments(deletedRecognition.attachments);
    }

    // Send a successful response, with no content
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

// @desc     Update a recognition by ID
// @route    PUT /api/recognitions/:recognitionId
// @access   Private
const updateRecognition = asyncHandler(async (req, res, next) => {
  const { recognitionId } = req.params;
  const { sender, receiver, category, reason, pointsAwarded, isAnonymous } =
    req.body;

  // Validate pointsAwarded
  if (isNaN(pointsAwarded)) {
    return next(new CustomError("Points awarded must be a number", 400));
  }

  let newAttachments = [];
  if (req.files && req.files.attachments) {
    newAttachments = req.files.attachments.map((file) => ({
      filename: file.filename,
      path: `${process.env.BASE_URL}/uploads/${
        file.mimetype.startsWith("image/") ? "images" : "videos"
      }/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
      fileType: file.mimetype.startsWith("image/") ? "image" : "video",
    }));
  }

  try {
    // Find the recognition
    const recognition = await Recognition.findById(recognitionId);
    if (!recognition) {
      deleteAttachments(newAttachments);
      return next(new CustomError("Recognition not found", 404));
    }

    // Find the sender and receiver
    const [senderUser, receiverUser] = await Promise.all([
      User.findById(sender),
      User.findById(receiver),
    ]);

    if (!senderUser || !receiverUser) {
      const whichOne = senderUser
        ? "Receiver is"
        : receiverUser
        ? "Sender is"
        : "Sender and receiver are";
      deleteAttachments(newAttachments);
      return next(new CustomError(`${whichOne} not found`, 404));
    }

    // Check if the sender and receiver are the same
    if (senderUser._id.equals(receiverUser._id)) {
      deleteAttachments(newAttachments);
      return next(new CustomError("Cannot recognize yourself", 400));
    }

    // Update points if they've changed
    if (recognition.pointsAwarded !== parseInt(pointsAwarded, 10)) {
      await Promise.all([
        User.findByIdAndUpdate(
          senderUser._id,
          {
            $inc: {
              "points.sent":
                senderUser.points.sent > 0 ? -parseInt(pointsAwarded, 10) : 0,
              "recognitions.sent": 1,
            },
          },
          { new: true }
        ),
        User.findByIdAndUpdate(
          receiverUser._id,
          {
            $inc: {
              "points.received": parseInt(pointsAwarded, 10),
              "recognitions.received": 1,
            },
          },
          { new: true }
        ),
      ]);
    }

    // Update recognition document
    const oldAttachments = recognition.attachments;
    const updatedRecognition = await Recognition.findByIdAndUpdate(
      recognitionId,
      {
        sender,
        receiver,
        category,
        reason,
        pointsAwarded,
        isAnonymous,
        attachments:
          newAttachments.length > 0 ? newAttachments : oldAttachments,
      },
      { new: true }
    );

    // Remove old attachments if new attachments are added
    if (updateRecognition && newAttachments.length > 0) {
      deleteAttachments(oldAttachments);
    }

    // Send the updated recognition
    res.status(200).json(updatedRecognition);
  } catch (error) {
    // Handle errors
    deleteAttachments(newAttachments);
    next(error);
  }
});

// @desc     Add or remove a like from a recognition
// @route    PUT /api/recognitions/:recognitionId/like
// @access   Private
const addRemoveLike = asyncHandler(async (req, res, next) => {
  const { recognitionId } = req.params;
  const userId = req.user.id;

  // Find the recognition and populate sender and receiver
  const recognition = await Recognition.findById(recognitionId).populate(
    "sender receiver"
  );

  if (!recognition) {
    return next(new CustomError("Recognition not found", 404));
  }

  // Check if user already liked the recognition
  if (recognition.likes.some((like) => like.toString() === userId)) {
    // If user has liked, remove the like
    recognition.likes = recognition.likes.filter(
      (like) => like.toString() !== userId
    );
  } else {
    // If user has not liked, add the like
    recognition.likes.push(userId);
  }

  // Save the updated recognition document
  await recognition.save();

  // Return the updated recognition with populated fields
  res.status(200).json(recognition);
});

// @desc     Add or remove a bookmark from a recognition
// @route    PUT /api/recognitions/:recognitionId/bookmark
// @access   Private
const addRemoveBookmark = asyncHandler(async (req, res, next) => {
  const { recognitionId } = req.params;
  const userId = req.user.id;

  // Find the recognition by ID
  const recognition = await Recognition.findById(recognitionId).populate(
    "sender receiver"
  );

  if (!recognition) {
    return next(new CustomError("Recognition not found", 404));
  }

  // Check if the user has already bookmarked this recognition
  if (
    recognition.savedBy.some((savedUser) => savedUser.toString() === userId)
  ) {
    // If the user has bookmarked, remove the bookmark
    recognition.savedBy = recognition.savedBy.filter(
      (savedUser) => savedUser.toString() !== userId
    );
  } else {
    // If the user hasn't bookmarked, add the bookmark
    recognition.savedBy.push(userId);
  }

  // Save the recognition document with updated bookmarks
  await recognition.save();

  // Return the updated recognition with populated fields
  res.status(200).json(recognition);
});

// @desc     Get all bookmarks for a specified user
// @route    GET /api/recognitions/:userId/bookmarks
// @access   Private
const getUserBookmarks = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  // Find all recognitions bookmarked by the user
  const bookmarks = await Recognition.find({ savedBy: userId }).populate(
    "sender receiver"
  );

  // If no bookmarks are found, return an error
  if (!bookmarks) {
    return next(new CustomError("No bookmarks found for this user", 404));
  }

  // Return the bookmarks
  res.status(200).json(bookmarks);
});

export {
  getAllRecognitions,
  getRecognition,
  createRecognition,
  deleteRecognition,
  updateRecognition,
  addRemoveLike,
  addRemoveBookmark,
  getUserBookmarks,
};
