import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },

    fullName: {
      type: String,
      required: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    profilePic: {
      type: String,
      default: ""
    },

    bio: {
      type: String
    }
  },
  { timestamps: true }
);


// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { userId: this._id },       // ✅ was "_id", now "userId"
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};
const User = mongoose.model("User", userSchema);

export default User;