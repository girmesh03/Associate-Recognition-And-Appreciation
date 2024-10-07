import mongoose from "mongoose";

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
      minlength: [5, "At least 5 characters are required."],
      maxlength: [500, "Maximum 500 characters allowed."],
      trim: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: [1, "Allowed minimum rating is 1."],
      max: [100, "Allowed maximum rating is 100."],
      required: [true, "Rating is required."],
    },
    votes: {
      type: Number,
      default: 0,
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
