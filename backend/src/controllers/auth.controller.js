import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"


export async function register(req,res){
    const {username,password} =req.body;

    const isalreadyexist =await userModel.findOne({username});

    if(isalreadyexist){
        return res.status(400).json({
            message:"username is already exist",
        })
    }

    const hash =await bcrypt.hash(password,10);

    const user =await userModel.create({
        username ,
        password:hash,
    })

    const token =await jwt.sign({
        id :user._id,
        username :user.username,
    },process.env.JWT_SECRET,{
        expiresIn:"3d",
    });

    res.cookie("token",token);

    return res.status(200).json({
        message:"user registered successfully",
        user :{
            id:user._id,
            username :user.username,
        }
    })
}  


export async function login(req,res){
    const {username ,password} =req.body;

    const user =await userModel.findOne({username});

    if(!user){
        return res.status(400).json({
            message:"user not found",
        })
    }

    const ispassword =await bcrypt.compare(password,user.password);

    if(!ispassword){
        return res.status(400).json({
            message:"incorrect password",
        })
    }


    const token =await jwt.sign({
        id:user._id,
        username:user.username
    },process.env.JWT_SECRET,{
        expiresIn:"3d",
    })

    res.cookie("token",token);

    return res.status(200).json({
        message:"user login successfully",
        user :{
            id:user._id,
            username :user.username
        }
    })
}


export async function getMe(req,res){
    const user =await userModel.findById(req.user.id);
    if (!user) {
        return res.status(404).json({
            message: "user not found"
        });
    }

    return res.status(200).json({
        message:"user fetch successfully",
        user:{
            id:user._id,
            username :user.username
        }
    })
}

export async function logout(req,res){
    res.clearCookie("token");

    return res.status(200).json({
        message:"user logout successfully",
    })
}