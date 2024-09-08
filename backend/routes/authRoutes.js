import express from "express";
import {
  signup,
  login,
  logout,
  refreshAccessToken,
} from "../controllers/authController.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").delete(logout);
router.route("/refresh").get(refreshAccessToken);

export default router;
