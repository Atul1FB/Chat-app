import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { uploadOnCloudinary } from "../lib/cloudinary.js";

// Signup
export const signup = asyncHandler(async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    if (!fullName || !email || !password || !bio) {
        return res.status(400).json({
            success: false,
            message: "Missing details"
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        fullName,
        email,
        password: hashedPassword,
        bio
    });

    const token = newUser.generateRefreshToken();
    console.log("4. Token generated:", token)

    //  Include userData in response
    res.status(201).json({
        success: true,
        message: "Account created successfully",
        userData: {
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            bio: newUser.bio,
            profilePic: newUser.profilePic
        },
        token
    });
});

//  Login 
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
     console.log("1. Login hit - body:", req.body);

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }
    const userData = await User.findOne({ email });
        console.log("2. User found:", userData?._id);

    if (!userData) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
     console.log("3. Password correct:", isPasswordCorrect);
    if (!isPasswordCorrect) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    const token = userData.generateRefreshToken();
      console.log("4. Token generated:", token)
    return res.status(200).json({
        success: true,
        message: "Login successful",
        userData: {
            _id: userData._id,
            fullName: userData.fullName,    
            email: userData.email,
            bio: userData.bio,
            profilePic: userData.profilePic
        },
        token
    });
});

//  checkAuth  
export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
};

// updateProfile
export const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updateData = { bio, fullName };

    // Only upload if profilePic exists
    if (profilePic) {
      const upload = await uploadOnCloudinary(profilePic);

      if (!upload) {
        return res.status(400).json({
          success: false,
          message: "Image upload failed",
        });
      }

      updateData.profilePic = upload.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    res.json({ success: true, user: updatedUser });

  } catch (error) {
    console.log("Update Profile Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});