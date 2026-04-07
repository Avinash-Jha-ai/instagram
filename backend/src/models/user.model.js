import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
}, { timestamps: true })

// userSchema.index({ googleId: 1 }, { sparse: true, unique: true })

const userModel = mongoose.model("User", userSchema)

export default userModel;