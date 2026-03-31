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