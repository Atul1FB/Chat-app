import express from "express"
import { checkAuth, login, signup, updateProfile } from "../controllers/Usercontrollers.js"
import { protectRoute } from "../midelware/auth.js";

const userRouter  = express.Router();

userRouter.post("/signup",signup)
userRouter.post("/login",login)
userRouter.put("/update-profile",protectRoute, updateProfile)// using put couz we are updateting data
userRouter.get('/check',protectRoute,checkAuth)// checking user is authenicate or not

export default userRouter