import express from "express";
import {
  createNomination,
  getAllNominations,
  getNomination,
  deleteNomination,
  updateNomination,
  addRemoveVote,
  addRemoveLike,
  addRemoveBookmark,
  getUserBookmarks,
} from "../controllers/nominationController.js";

import checkOwnershipOrAdmin from "../middlewares/ownershipOrAdmin.js";

const router = express.Router();

// Route to get all nominations and create a new nomination
router.route("/").get(getAllNominations).post(createNomination);

// Route to handle a single nomination (get, update, delete)
router
  .route("/:nominationId")
  .get(getNomination)
  .put(
    checkOwnershipOrAdmin("Nomination", "nominationId", "nominator", "nominee"),
    updateNomination
  )
  .delete(
    checkOwnershipOrAdmin("Nomination", "nominationId", "nominator", "nominee"),
    deleteNomination
  );

// Route to add or remove a vote from a nomination
router.route("/:nominationId/vote").put(addRemoveVote);

// Route to add or remove a like from a nomination
router.route("/:nominationId/like").put(addRemoveLike);

// Route to add or remove a bookmark from a nomination
router.route("/:nominationId/bookmark").put(addRemoveBookmark);

// Route to get all bookmarks for the authenticated user
router.route("/:userId/bookmarks").get(getUserBookmarks);

export default router;
