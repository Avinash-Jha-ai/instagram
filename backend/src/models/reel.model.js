import mongoose from "mongoose";

const reelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  title:{
    type: String,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  }],
  sharesCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const reelModel = mongoose.model("Reel", reelSchema);

export default reelModel;