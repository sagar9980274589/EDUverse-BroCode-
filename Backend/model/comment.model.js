import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({

author:{type:mongoose.Schema.Types.ObjectId,ref:'User',require:true},
post:{type:mongoose.Schema.Types.ObjectId,ref:'Post',require:true},
comment:{type:String,require:true}

},{timestamps:true})

export default mongoose.model('Comment',commentSchema)