import { Router } from "express";
import {createReel,getReels,getReelById,updateReel,deleteReel} from "../controllers/reel.controller.js";
import {protect} from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";

const reelRouter = Router();

reelRouter.post("/", protect, upload.single("video"), createReel);
reelRouter.get("/", getReels);
reelRouter.get("/:id", getReelById);
reelRouter.delete("/:id", protect, deleteReel);
reelRouter.put("/:id", protect, upload.single("video"), updateReel);

export default reelRouter;