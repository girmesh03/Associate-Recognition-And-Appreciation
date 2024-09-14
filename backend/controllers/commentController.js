import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Recognition from "../models/recognitionModel.js";
import Nomination from "../models/nominationModel.js";
import Appreciation from "../models/appreciationModel.js";
import Comment from "../models/commentModel.js";
import CustomError from "../utils/CustomError.js";

// @desc     Add a comment to an entity
// @route    POST /api/comments
// @access   Private
const addComment = asyncHandler(async (req, res, next) => {
  const { postId, postType, comment } = req.body;
  const userId = req.user.id;

  // Validate postType
  if (!["recognition", "nomination", "appreciation"].includes(postType)) {
    return next(new CustomError("Invalid post type", 400));
  }

  // Validate postId
  let entity;
  switch (postType) {
    case "recognition":
      entity = await Recognition.findById(postId);
      break;
    case "nomination":
      entity = await Nomination.findById(postId);
      break;
    case "appreciation":
      entity = await Appreciation.findById(postId);
      break;
  }

  if (!entity) {
    return next(new CustomError("Post not found", 404));
  }

  // Create a new comment
  const newComment = new Comment({
    user: userId,
    comment,
    postType,
    postId,
  });

  // Save the new comment
  await newComment.save();

  // Add the comment to the entity
  entity.comments.push(newComment._id);
  await entity.save();

  const response = await Comment.findById(newComment._id).populate("user");

  // Respond with the updated entity
  res.status(200).json(response);
});

//@desc     Get a post's comments, post: recognition, nomination, appreciation
//@route    GET /api/comments?postId=:postId&postType=recognition
//@access   Private
const getPostComments = asyncHandler(async (req, res, next) => {
  const { postId, postType } = req.query;

  // Validate postType
  if (!["recognition", "nomination", "appreciation"].includes(postType)) {
    return next(new CustomError("Invalid post type", 400));
  }

  // Fetch the entity to ensure it exists
  let entity;
  switch (postType) {
    case "recognition":
      entity = await Recognition.findById(postId);
      break;
    case "nomination":
      entity = await Nomination.findById(postId);
      break;
    case "appreciation":
      entity = await Appreciation.findById(postId);
      break;
  }

  if (!entity) {
    return next(new CustomError("Post not found", 404));
  }

  // Construct the query to fetch all comments
  const query = { postId, postType };

  // Fetch comments based on the constructed query
  const comments = await Comment.find(query).populate("user");

  // Respond with the comments (empty array if none found)
  res.status(200).json(comments);
});

// @desc     Delete a comment
// @route    DELETE /api/comments/:commentId
// @access   Private
const deleteComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  // Find the comment
  const comment = await Comment.findById(commentId);

  if (!comment) {
    return next(new CustomError("Comment not found", 404));
  }

  // Check if the user is the owner of the comment or an admin
  if (comment.user.toString() !== userId && req.user.role !== "admin") {
    return next(new CustomError("Not authorized to delete this comment", 403));
  }

  // Find the related entity and remove the comment reference
  const { postId, postType } = comment;

  // Use a single update operation to remove the comment reference
  const updateQuery = { $pull: { comments: commentId } };

  if (postType === "recognition") {
    await Recognition.findByIdAndUpdate(postId, updateQuery);
  } else if (postType === "nomination") {
    await Nomination.findByIdAndUpdate(postId, updateQuery);
  } else if (postType === "appreciation") {
    await Appreciation.findByIdAndUpdate(postId, updateQuery);
  }

  // Delete the comment
  await Comment.findByIdAndDelete(commentId);

  // Respond with success message
  res.status(200).json({ message: "Comment deleted successfully" });
});

export { addComment, getPostComments, deleteComment };
