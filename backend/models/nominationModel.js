import mongoose from "mongoose";
import { attachmentSchema } from "./reusableSchemas.js";

const nominationSchema = new mongoose.Schema(
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
      enum: ["Associate of the Month", "Associate of the Year"],
      required: true,
    },
    justification: {
      type: String,
      required: true,
      minlength: [5, "Justification must be at least 5 characters long."],
      maxlength: [500, "Justification must be at most 500 characters long."],
      trim: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    rating: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    votes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    attachments: {
      type: [attachmentSchema],
      validate: {
        validator: function (v) {
          return v.length <= 5;
        },
        message: (props) => `You can upload a maximum of 5 files!`,
      },
    },
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

const Nomination = mongoose.model("Nomination", nominationSchema);

export default Nomination;
