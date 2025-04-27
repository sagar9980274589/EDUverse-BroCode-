import mongoose from "mongoose";


const conversationSchema = new mongoose.Schema({

participants:[{type:mongoose.Schema.Types.ObjectId,ref:'User',require:true}],
messages:[{type:mongoose.Schema.Types.ObjectId,ref:'Message',require:true}]

},{timestamps:true})

export default mongoose.model('Converstation',conversationSchema)