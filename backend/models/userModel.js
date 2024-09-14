import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name field is required"],
      minLength: [2, "Minimum 2 characters allowed"],
      maxLength: [15, "Maximum 15 characters allowed"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name field is required"],
      minLength: [2, "Minimum 2 characters allowed"],
      maxLength: [15, "Maximum 15 characters allowed"],
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Please select department"],
    },
    position: {
      type: String,
      required: [true, "Please select position"],
    },
    email: {
      type: String,
      required: [true, "Email field is required"],
      lowercase: true,
      unique: true,
      maxLength: [50, "Maximum 50 characters allowed"],
    },
    password: {
      type: String,
      required: [true, "Password field is required"],
      minLength: [5, "Minimum password length is 5 characters"],
      maxLength: [20, "Maximum password length is 20 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePicture: {
      type: String,
      default: "",
      // default: "http://localhost:4000/uploads/default/noAvatar.webp",
    },
    coverPicture: {
      type: String,
      default: "",
      // default: "http://localhost:4000/uploads/default/noCover.webp",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    points: {
      sent: {
        type: Number,
        default: 0,
      },
      received: {
        type: Number,
        default: 0,
      },
    },
    recognitions: {
      sent: {
        type: Number,
        default: 0,
      },
      received: {
        type: Number,
        default: 0,
      },
    },
    appreciations: {
      sent: {
        type: Number,
        default: 0,
      },
      received: {
        type: Number,
        default: 0,
      },
    },
    nominations: {
      count: {
        type: Number,
        default: 0,
      },
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
