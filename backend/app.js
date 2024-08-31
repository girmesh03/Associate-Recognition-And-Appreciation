import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";

import corsOptions from "./config/corsOptions.js";
import globalErrorHandler from "./controllers/errorController.js";
import CustomError from "./utils/CustomError.js";

import protect from "./middlewares/protect.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recognitionRoutes from "./routes/recognitionRoutes.js";
import nominationRoutes from "./routes/nominationRoutes.js";
import appreciationRoutes from "./routes/appreciationRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", protect, userRoutes);
app.use("/api/recognitions", protect, recognitionRoutes);
app.use("/api/nominations", protect, nominationRoutes);
app.use("/api/appreciations", protect, appreciationRoutes);

app.all("*", (req, res, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
