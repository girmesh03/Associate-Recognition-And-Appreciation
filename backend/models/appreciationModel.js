import mongoose from "mongoose";
import { attachmentSchema } from "./reusableSchemas.js";

const appreciationSchema = new mongoose.Schema(
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
    message: {
      type: String,
      required: true,
      minlength: [5, "Message must be at least 5 characters long."],
      maxlength: [500, "Message must be at most 500 characters long."],
      trim: true,
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

const Appreciation = mongoose.model("Appreciation", appreciationSchema);

export default Appreciation;
