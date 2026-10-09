import message from "../model/message.js";
import User from "../model/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

//Get all user except login user
export const getUserForSidebar = async(req,res)=>{
  try{
    const userId = req.user._id;
    const filteredUser = await User.find({_id:{$ne:userId}}).select("-password");
    //count number of messages
    const unseenmessages = {}
    const promises = filteredUsers.map(async(user)=>{
      const messages = await message.find({senderId:user._id,recieverId:userId,seen:false})
      if(messages.length>0){
        unseenmessages[user._id] = messages.length;
      }
    })
    await Promise.all(promises);
    res.json({success:true,users:filteredUsers,unseenmessages})
  }
  catch(error){
    console.log(error.message);
    res.json({success:false, message:error.message});
  }
}
//Get all message for selected user
export const getMessages = async(req,res)=>{
  try{
    const {id:selectedUserId} = req.params;
    const myId = req.User._id;
    const messages = await message.find({
      $or:[
        {senderId:myId, recieverId:selectedUserId},
        {senderId:selectedUserId, recieverId:myId},
      ]
    })
    await message.updateMany({senderId:myId,recieverId:myId},
      {seen:true});
      res.json({success:true,messages})

  }catch(error){
    console.log(error.message);
    res.json({success:false,message:error.message})
  }
}
//api to mark message As seen
export const markMessageAsSeen = async (req,res)=>{
  try{
    const {id} =req.params;
    await message.findByIdAndUpdate(id,{seen:true})
    res.json({success:true})
  }
  catch (error){
    console.log(error.message);
    res.json({success:false, message:error.message})
  }
}
//send message to selected user

export const sendMessage = async(req,res)=>{
  try{
    const {text,image} = req.body;
    const recieverId = req.params.id;
    const senderId = req.user._id;
    let imageurl;
    if(image){
      const uploadresponse = await cloudinary.uploader.upload(image);
      imageurl = uploadresponse.secure_url;
    }
    const newMessage = await message.create({
      senderId,
      recieverId,
      text,
      image:imageurl
    })

    //Emit the new message to the recievers socket
    const recieverSocketId = userSocketMap[recieverId];
    if(recieverSocketId){
      io.to(recieverSocketId).emit("new Message",newMessage)
    }


    res.json({success:true,newMessage})
  }
  catch(error){
    console.log(error.message);
    res.json({success:false, message:error.message})
  }
}
