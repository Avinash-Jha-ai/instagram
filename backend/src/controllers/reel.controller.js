import reelModel from "../models/reel.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export async function createReel(req, res) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(file.path);
    const videoUrl = result.secure_url;

    const { title } = req.body;

    const reel = new reelModel({
      user: req.user.id,
      video: videoUrl,
      title,
    });

    await reel.save();

    return res.status(201).json({
      message: "Reel created successfully",
      reel,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

export async function getReels(req, res) {
  try {
    const reels = await reelModel
      .find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Reels fetched successfully",
      reels,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

export async function getReelById(req, res) {
  try {
    const reel = await reelModel
      .findById(req.params.id)
      .populate("user", "username");

    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    return res.status(200).json({
      message: "Reel fetched successfully",
      reel,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

export async function updateReel(req, res) {
  try {
    const reel = await reelModel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    if (reel.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { title } = req.body;

    if (title) {
      reel.title = title;
    }

    const file = req.file;

    if (file) {
      const result = await uploadToCloudinary(file.path);
      reel.video = result.secure_url;
    }

    await reel.save();

    return res.status(200).json({
      message: "Reel updated successfully",
      reel,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

export async function deleteReel(req, res) {
  try {
    const reel = await reelModel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    if (reel.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await reel.deleteOne();

    return res.status(200).json({
      message: "Reel deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

export async function likeReel(req, res) {
  try {
    const reel = await reelModel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    const userId = req.user.id;
    const alreadyLiked = reel.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      return res.status(400).json({ message: "Reel already liked" });
    }

    reel.likes.push(userId);
    await reel.save();

    return res.status(200).json({
      message: "Reel liked successfully",
      likesCount: reel.likes.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

export async function unlikeReel(req, res) {
  try {
    const reel = await reelModel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    const userId = req.user.id;
    reel.likes = reel.likes.filter((id) => id.toString() !== userId);
    await reel.save();

    return res.status(200).json({
      message: "Reel unliked successfully",
      likesCount: reel.likes.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

export async function shareReel(req, res) {
  try {
    const reel = await reelModel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    reel.sharesCount += 1;
    await reel.save();

    return res.status(200).json({
      message: "Reel shared successfully",
      sharesCount: reel.sharesCount,
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

    const reel = await reelModel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    reel.comments.push({
      user: req.user.id,
      text: text.trim(),
    });

    await reel.save();
    await reel.populate("comments.user", "username");

    return res.status(201).json({
      message: "Comment added successfully",
      comments: reel.comments,
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
    const reel = await reelModel.findById(id);

    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    const comment = reel.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user.id && reel.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.deleteOne();
    await reel.save();

    return res.status(200).json({
      message: "Comment deleted successfully",
      comments: reel.comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}