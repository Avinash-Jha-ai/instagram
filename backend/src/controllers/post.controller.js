import postModel from "../models/post.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export async function createPost(req, res) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(file.path);
    const imageUrl = result.secure_url;

    const { caption } = req.body;

    const post = new postModel({
      user: req.user.id,
      caption,
      image: imageUrl,
    });

    await post.save();

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

export async function getPosts(req, res) {
  try {
    const posts = await postModel
      .find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

export async function getPostById(req, res) {
  try {
    const post = await postModel
      .findById(req.params.id)
      .populate("user", "username");
      
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }   

    return res.status(200).json({
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

export async function deletePost(req, res) {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

export async function updatePost(req, res) {
  try {
    const file = req.file;
    let imageUrl;

    if (file) {
      const result = await uploadToCloudinary(file.path);
      imageUrl = result.secure_url;
    }

    const { caption } = req.body;

    let post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    post.caption = caption || post.caption;
    post.image = imageUrl || post.image;

    await post.save();

    return res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

