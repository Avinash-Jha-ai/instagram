import {Router} from 'express';
import {
  updateProfile,
  getProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../controllers/profile.controller.js";
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
profileRouter.post("/follow/:userId", protect, followUser);
profileRouter.delete("/follow/:userId", protect, unfollowUser);
profileRouter.get("/followers/:userId", protect, getFollowers);
profileRouter.get("/following/:userId", protect, getFollowing);

export default profileRouter;