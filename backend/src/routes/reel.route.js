import { Router } from "express";
import {
  createReel,
  getReels,
  getReelById,
  updateReel,
  deleteReel,
  likeReel,
  unlikeReel,
  shareReel,
  addComment,
  deleteComment
} from "../controllers/reel.controller.js";
import {protect} from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";

const reelRouter = Router();

reelRouter.post("/", protect, upload.single("video"), createReel);
reelRouter.get("/", getReels);
reelRouter.get("/:id", getReelById);
reelRouter.delete("/:id", protect, deleteReel);
reelRouter.put("/:id", protect, upload.single("video"), updateReel);

reelRouter.post("/:id/like", protect, likeReel);
reelRouter.delete("/:id/like", protect, unlikeReel);
reelRouter.post("/:id/share", protect, shareReel);
reelRouter.post("/:id/comments", protect, addComment);
reelRouter.delete("/:id/comments/:commentId", protect, deleteComment);

export default reelRouter;