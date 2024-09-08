import express from "express";
import {
  addComment,
  getAllComments,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

// Route to add a comment to an entity
router.route("/").post(addComment);

// Route to get all comments for an entity
router.route("/").get(getAllComments);

// Route to delete a comment
router.route("/:commentId").delete(deleteComment);

export default router;
