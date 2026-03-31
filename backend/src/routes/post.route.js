import { Router } from "express";

import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";
import { getPosts,createPost ,getPostById,deletePost,updatePost} from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.post("/", protect, upload.single("image"), createPost);
postRouter.get("/", getPosts);
postRouter.get("/:id", getPostById);
postRouter.delete("/:id", protect, deletePost);
postRouter.put("/:id", protect, upload.single("image"), updatePost);



export default postRouter;