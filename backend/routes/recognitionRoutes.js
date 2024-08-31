import express from "express";
import { getAllRecognitions } from "../controllers/recognitionController.js";

const router = express.Router();

router.route("/").get(getAllRecognitions);

export default router;
