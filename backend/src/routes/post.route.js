import { Router } from "express";

import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";
import {
  getPosts,
  createPost,
  getPostById,
  deletePost,
  updatePost,
  likePost,
  unlikePost,
  sharePost,
  addComment,
  deleteComment,
} from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.post("/", protect, upload.single("image"), createPost);
postRouter.get("/", getPosts);
postRouter.get("/:id", getPostById);
postRouter.delete("/:id", protect, deletePost);
postRouter.put("/:id", protect, upload.single("image"), updatePost);
postRouter.post("/:id/like", protect, likePost);
postRouter.delete("/:id/like", protect, unlikePost);
postRouter.post("/:id/share", protect, sharePost);
postRouter.post("/:id/comments", protect, addComment);
postRouter.delete("/:id/comments/:commentId", protect, deleteComment);



export default postRouter;