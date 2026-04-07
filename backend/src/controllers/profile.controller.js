import profileModel from "../models/profile.model.js";
import {uploadToCloudinary} from "../utils/uploadToCloudinary.js"
import userModel from "../models/user.model.js";



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
    let profile =await profileModel.findOne({user:req.user.id}).populate("user","username followers following");

    if(!profile){
        let userObj = await userModel.findById(req.user.id).select("username followers following");
        return res.status(200).json({
            message: "profile not found, returning empty",
            profile: { user: userObj },
        })
    }

    return res.status(200).json({
        message:"profile fetched successfully",
        profile,
    })

}

export async function getProfileByUserId(req,res){
    const { userId } = req.params;
    let profile = await profileModel.findOne({user: userId}).populate("user","username followers following");
    
    if(!profile){
         profile = { user: await userModel.findById(userId).select("username followers following") };
         if (!profile.user) {
             return res.status(404).json({ message: "User not found" });
         }
    }

    return res.status(200).json({
        message:"profile fetched successfully",
        profile,
    })
}

export async function followUser(req, res) {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.userId;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const [currentUser, targetUser] = await Promise.all([
      userModel.findById(currentUserId),
      userModel.findById(targetUserId),
    ]);

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    const alreadyFollowing = currentUser.following.some(
      (id) => id.toString() === targetUserId
    );

    if (alreadyFollowing) {
      return res.status(400).json({ message: "Already following this user" });
    }

    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await Promise.all([currentUser.save(), targetUser.save()]);

    return res.status(200).json({
      message: "User followed successfully",
      followingCount: currentUser.following.length,
      targetFollowersCount: targetUser.followers.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

export async function unfollowUser(req, res) {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.userId;

    const [currentUser, targetUser] = await Promise.all([
      userModel.findById(currentUserId),
      userModel.findById(targetUserId),
    ]);

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );

    await Promise.all([currentUser.save(), targetUser.save()]);

    return res.status(200).json({
      message: "User unfollowed successfully",
      followingCount: currentUser.following.length,
      targetFollowersCount: targetUser.followers.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

export async function getFollowers(req, res) {
  try {
    const userId = req.params.userId || req.user.id;
    const user = await userModel
      .findById(userId)
      .populate("followers", "username");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Followers fetched successfully",
      followers: user.followers,
      count: user.followers.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}

export async function getFollowing(req, res) {
  try {
    const userId = req.params.userId || req.user.id;
    const user = await userModel
      .findById(userId)
      .populate("following", "username");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Following fetched successfully",
      following: user.following,
      count: user.following.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error,
    });
  }
}
