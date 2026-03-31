import profileModel from "../models/profile.model.js";
import {uploadToCloudinary} from "../utils/uploadToCloudinary.js"



export async function updateProfile(req, res) {
  try {
    const file = req.file;
    let imageUrl;
    if (file) {
      const result = await uploadToCloudinary(file.path);
      imageUrl = result.secure_url;
    }

    const { bio, name } = req.body; // ✅ include name

    let profile = await profileModel.findOne({ user: req.user.id });

    if (profile) {
      profile.bio = bio || profile.bio;
      profile.avatar = imageUrl || profile.avatar;
      profile.name = name || profile.name; // ✅ update name

      await profile.save();

      return res.status(200).json({
        message: "profile updated successfully",
        profile,
      });
    }

    profile = new profileModel({
      user: req.user.id,
      bio,
      avatar: imageUrl,
      name, // ✅ save name when creating
    });

    await profile.save();

    return res.status(201).json({
      message: "profile created successfully",
      profile,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}
export async function getProfile(req,res){
    const profile =await profileModel.findOne({user:req.user.id}).populate("user","username");

    if(!profile){
        return res.status(404).json({
            message:"profile not found",
        })
    }

    return res.status(200).json({
        message:"profile fetched successfully",
        profile,
    })

}
