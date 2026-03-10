import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import User from "../models/User.js"

export const protectRoute = asyncHandler(async(req, res, next) => {
    try {
           const authHeader = req.headers.authorization;
     console.log("A. Auth header received:", authHeader);
     
        const token = req.headers.authorization?.split(" ")[1];
           console.log("B. Extracted token:", token);

        if (!token) {
             console.log("C. ❌ No token found!");
            return res.status(401).json({ 
                success: false, 
                message: "No token provided" 
            });
        }

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
         console.log("D. Decoded token:", decoded);

        const user = await User.findById(decoded?.userId).select("-password");
            console.log("E. User found:", user?._id);

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        req.user = user;
        next();

    } catch(error) {
        console.log("JWT verification error", error.message);
      
        res.status(401).json({ success: false, message: error.message });
    }
});