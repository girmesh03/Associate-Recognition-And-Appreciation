import express from "express";
import checkOwnershipOrAdmin from "../middlewares/ownershipOrAdmin.js";
import upload from "../middlewares/multerMiddleware.js";
import {
  getAllRecognitions,
  getRecognition,
  createRecognition,
  deleteRecognition,
  updateRecognition,
  addRemoveLike,
  addRemoveBookmark,
  getUserBookmarks,
} from "../controllers/recognitionController.js";

const router = express.Router();

// Route to get all recognitions and create a new recognition
router
  .route("/")
  .get(getAllRecognitions)
  .post(upload.fields([{ name: "attachments" }]), createRecognition);

// Route to handle a single recognition (get, update, delete)
router
  .route("/:recognitionId")
  .get(getRecognition)
  .put(
    checkOwnershipOrAdmin("Recognition", "recognitionId"),
    upload.fields([{ name: "attachments" }]),
    updateRecognition
  )
  .delete(
    checkOwnershipOrAdmin("Recognition", "recognitionId"),
    deleteRecognition
  );

// Route to add or remove a like from a recognition
router.route("/:recognitionId/like").put(addRemoveLike);

// Route to add or remove a bookmark from a recognition
router.route("/:recognitionId/bookmark").put(addRemoveBookmark);

// Route to get all bookmarks for the authenticated user
router.route("/:userId/bookmarks").get(getUserBookmarks);

export default router;
