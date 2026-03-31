import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
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
  }
});

const reelModel = mongoose.model("Reel", postSchema);

export default reelModel;