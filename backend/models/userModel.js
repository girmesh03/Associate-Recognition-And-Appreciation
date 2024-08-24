import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [2, "First name must be at least 2 characters long"],
      maxLength: [15, "First name must be at most 15 characters long"],
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: [2, "Last name must be at least 2 characters long"],
      maxLength: [15, "Last name must be at most 15 characters long"],
      trim: true,
    },
    department: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      maxLength: [50, "Email must be at most 50 characters long"],
    },
    password: {
      type: String,
      required: true,
      minLength: [5, "Password must be at least 8 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePicture: {
      type: String,
      default: "http://localhost:4000/uploads/default/noAvatar.jpg",
    },
    coverPicture: {
      type: String,
      default: "http://localhost:4000/uploads/default/noCover.jpg",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    availablePoints: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

UserSchema.index({
  firstName: "text",
  lastName: "text",
  department: "text",
  position: "text",
});

// Middleware to capitalize first letter of first name and last name
UserSchema.pre("save", function (next) {
  if (this.isModified("firstName") || this.isNew) {
    this.firstName =
      this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1);
  }

  if (this.isModified("lastName") || this.isNew) {
    this.lastName =
      this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1);
  }
  next();
});

// Middleware to hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;
