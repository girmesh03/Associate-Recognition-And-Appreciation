import mongoose from "mongoose";

const nominationSchema = new mongoose.Schema(
  {
    nominator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nominee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: {
        values: ["Associate of the month", "Associate of the year"],
        message: `{VALUE} is not a valid category!`,
      },
      required: [true, "Nomination Category is required"],
    },
    reason: {
      type: String,
      required: [true, "Please add a justification."],
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
    votes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
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
  },
  { timestamps: true }
);

const Nomination = mongoose.model("Nomination", nominationSchema);

export default Nomination;
