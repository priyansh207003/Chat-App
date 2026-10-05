import bcrypt from "bcryptjs"
import User from "../model/User";
import { generateToken } from "../lib/utils";
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
