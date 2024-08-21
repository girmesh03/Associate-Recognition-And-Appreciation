import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello There!" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
