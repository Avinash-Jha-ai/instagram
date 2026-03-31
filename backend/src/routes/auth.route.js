import userModel from "../models/user.model.js";
import {register ,login,getMe ,logout} from "../controllers/auth.controller.js"
import { Router } from "express";
import { registerValidationRules,loginValidationRules } from "../validators/auth.validator.js";
import { authUser } from "../middleware/auth.middleware.js";


const authRouter =Router();

authRouter.post("/register",registerValidationRules,register);
authRouter.post("/login",loginValidationRules,login);
authRouter.get("/get-me",authUser,getMe);
authRouter.get("/logout",authUser,logout);


export default authRouter;