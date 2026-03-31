import mongoose from "mongoose";
import User from "./user.model.js";
const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  name: {
    type: String,
    default: "User",
    required: true,
  },
  avatar: {
    type: String,
    default:"https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_incoming&w=740&q=80",
  },
  bio: {
    type: String,
  }
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;