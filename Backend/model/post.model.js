import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
image:{type:String,require:true},
caption:{type:String,default:""},
comments:[{type:mongoose.Schema.Types.ObjectId,ref:'Comment'}],
likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
author:{type:mongoose.Schema.Types.ObjectId,ref:'User',require:true}

},{timestamps:true})
export default mongoose.model('Post',postSchema)