import mongoose from "mongoose";

// Reusable Attachment Schema
const attachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  fileType: { type: String, enum: ["image", "video"], required: true },
});

export { attachmentSchema };
