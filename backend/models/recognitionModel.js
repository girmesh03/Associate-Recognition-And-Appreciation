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
      trim: true,
      required: [true, "Category field is required."],
    },
    reason: {
      type: String,
      required: [true, "Please add a reason."],
      maxlength: [500, "Maximum 500 characters allowed."],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    pointsAwarded: {
      type: Number,
      min: [1, "Minimum 1 point is required."],
      max: [100, "Maximum 100 points allowed."],
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    attachments: {
      type: [attachmentSchema],
      validate: {
        validator: function (v) {
          return v.length <= 2;
        },
        message: () => "Maximum 2 files are allowed!",
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
