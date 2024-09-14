import express from "express";
import {
  addComment,
  getPostComments,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

// Route to add a comment to an entity
router.route("/").post(addComment);

// Route to get all comments for an entity
router.route("/").get(getPostComments);

// Route to delete a comment
router.route("/:commentId").delete(deleteComment);

export default router;
