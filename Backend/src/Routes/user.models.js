import { Router } from "express";
import { loginUser, registerUser, addToActivity, getToActivity } from "../controllers/user.controller.js";


const userRouter = Router();

userRouter.route("/login").post(loginUser);
userRouter.route("/register").post(registerUser);
userRouter.route("/get_all_activity").get(getToActivity);
userRouter.route("/add_to_activity").post(addToActivity);

export { userRouter };