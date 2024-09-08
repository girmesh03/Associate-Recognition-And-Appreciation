import mongoose from "mongoose";

const RefreshTokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expireAt: {
    type: Date,
    default: Date.now,
    expires: "7d",
  },
});

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;
