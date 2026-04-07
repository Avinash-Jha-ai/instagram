import postModel from "../models/post.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

const postPopulate = [
  { path: "user", select: "username" },
  { path: "comments.user", select: "username" },
];

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
      .populate(postPopulate)
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
      .populate(postPopulate);
      
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

export async function likePost(req, res) {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      return res.status(400).json({ message: "Post already liked" });
    }

    post.likes.push(userId);
    await post.save();

    return res.status(200).json({
      message: "Post liked successfully",
      likesCount: post.likes.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

export async function unlikePost(req, res) {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;
    post.likes = post.likes.filter((id) => id.toString() !== userId);
    await post.save();

    return res.status(200).json({
      message: "Post unliked successfully",
      likesCount: post.likes.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

export async function sharePost(req, res) {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.sharesCount += 1;
    await post.save();

    return res.status(200).json({
      message: "Post shared successfully",
      sharesCount: post.sharesCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

export async function addComment(req, res) {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      user: req.user.id,
      text: text.trim(),
    });

    await post.save();
    await post.populate(postPopulate);

    return res.status(201).json({
      message: "Comment added successfully",
      comments: post.comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

export async function deleteComment(req, res) {
  try {
    const { id, commentId } = req.params;
    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.deleteOne();
    await post.save();

    return res.status(200).json({
      message: "Comment deleted successfully",
      comments: post.comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

