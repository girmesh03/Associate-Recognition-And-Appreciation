import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User id is required."],
  },
  comment: {
    type: String,
    required: [true, "Comment is required"],
    maxlength: [500, "Maximum 500 characters allowed"],
    trim: true,
  },
  postType: {
    type: String,
    enum: {
      values: ["recognition", "nomination", "appreciation"],
      message: `{VALUE} is not a valid post type!`,
    },
    required: [true, "Post type is required"],
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Post id is required."],
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
