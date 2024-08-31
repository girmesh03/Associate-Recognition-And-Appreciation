import express from "express";
import { getAllAppreciations } from "../controllers/appreciationController.js";

const router = express.Router();

router.route("/").get(getAllAppreciations);

export default router;
