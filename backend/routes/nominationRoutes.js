import express from "express";
import { getAllNominations } from "../controllers/nominationController.js";

const router = express.Router();

router.route("/").get(getAllNominations);

export default router;
