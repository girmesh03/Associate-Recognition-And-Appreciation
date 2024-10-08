import mongoose from "mongoose";

// Reusable Attachment Schema
const attachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  fileType: { type: String, enum: ["image", "video"], required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  thumbnail: { type: String, required: false },
});

export { attachmentSchema };
