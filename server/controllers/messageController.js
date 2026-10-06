import message from "../model/message.js";
import User from "../model/User.js";



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