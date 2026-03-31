import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  caption: { // ✅ add this
    type: String,
  },
}, { timestamps: true });


const PostModel = mongoose.model("Post", postSchema);

export default PostModel;