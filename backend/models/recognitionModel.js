import mongoose from "mongoose";
import { attachmentSchema } from "./reusableSchemas.js";

const recognitionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      minlength: [5, "Reason must be at least 5 characters long."],
      maxlength: [500, "Reason must be at most 500 characters long."],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    pointsAwarded: {
      type: Number,
      default: 0,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    attachments: {
      type: [attachmentSchema],
      validate: {
        validator: function (v) {
          return v.length <= 5;
        },
        message: (props) => `You can upload a maximum of 5 files!`,
      },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Recognition = mongoose.model("Recognition", recognitionSchema);

export default Recognition;
