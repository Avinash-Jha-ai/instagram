import {Router} from 'express';
import {updateProfile, getProfile} from "../controllers/profile.controller.js";
import {protect} from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";

const profileRouter = Router();

profileRouter.post(
  "/update",
  protect,
  upload.single("avatar"), // ✅ ONLY HERE
  updateProfile
);
profileRouter.get("/me",protect, getProfile);

export default profileRouter;