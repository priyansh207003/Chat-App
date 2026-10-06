import bcrypt from "bcryptjs"
import User from "../model/User.js";
import { generateToken } from "../lib/utils.js";
import cloudinary  from "../lib/cloudinary.js";
//Signup a new User
export const signup = async(req,res)=>{
  const {fullname, email, password,bio} = req.body;
  try{
    if(!fullname || !email || !password || !bio){
      return res.json({sucess:false, message:"Missing details"})
    }
    const User = await User.findOne({email});
    if(User){
      return res.json({success:false, message:"Account Already Exist"})
    }
    const salt  = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    
    const newUser = await User.create({
      fullname,email,password,hashedPassword,bio
    });
    const token = generateToken(newUser._id)
    res.json({sucess:true,userData: newUser, token, message:"Account Created Sucessfully"})

  }
  catch(error){
    console.log(error.message)
    res.json({sucess:false, message: error.message})
  }
}
//controller to login user

export const login = async (req,res)=>{
  try{
    const { email, password} = req.body;
    const userData = await User.findOne({email});
    const isPassword = await bcrypt.compare(process,userData.password);
    if(!isPassword){
      return res.json({sucess:false, message:"Invalid Credential"});
    }
    const token = generateToken(userData._id);
    res.json({sucess:true,message:"Login Sucessfully"});

  }catch(error){
    console.log(error.message);
    res.json({sucess:false, message: error.message})
  }
}
//controller to check user is authenticated
export const checkAuth = (req,res)=>{
  res.json({sucess:true,user:req.user});

}
//Controller to update user profile
export const updateprofile = async(req,res)=>{
  try{
    const {profilepic, bio,fullname} = req.body;
    const userId = req.user._id;
    let updatedUser 
    if(!profilepic){
      updatedUser = await User.findByIdAndUpdate(userId,{bio,fullName},{new:true})
    }else{
      const upload = await cloudinary.uploader.upload(profilepic);
      updatedUser = await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullname},{new:true});
    }
    res.json({success:true,user:updatedUser})
  }
  catch(error){
    console.log(error.message);
    res.json({success:false,message:error.message});
  }
}