import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  senderId: {type:mongoose.schema.Types.ObjectId,ref:"User", required:true},
  recieverId :{type:mongoose.schema.Types.ObjectId,ref:"User", required:true},
  text:{type:String,},
  image:{type:String,},
  seen:{type:Boolean,default:false}

},{timestamps:true});
const message = mongoose.model("message",messageSchema);
export default message; 
