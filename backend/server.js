import dotenv from "dotenv";
dotenv.config();

import http from "http";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";
import corsOptions from "./config/corsOptions.js";

// Import fake data
import { ImportDataStatus } from "./models/reusableSchemas.js";
import { ImportData } from "./data/fakeData.js";

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server from main server
const io = new SocketIOServer(server, {
  cors: corsOptions,
});

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Connect to MongoDB
connectDB();

mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB");

  // Initialize import status if it doesn't exist
  const existingStatus = await ImportDataStatus.findOne();
  if (!existingStatus) {
    await ImportDataStatus.create({ imported: false });
  }

  // Call import function
  await ImportData();

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  // TODO: Add better error handling instead of process.exit
  process.exit(1);
});

// Export the io instance for use in other modules
export { io };
