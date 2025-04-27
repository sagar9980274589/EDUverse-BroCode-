import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({})
const connectDB = async()=>{
    try{
const connected=await mongoose.connect(process.env.MONGO_URI);
if(connected){
    console.log("mongo db connected");
}
    }
    catch(err){
console.log("error connecting mongo:",err)
    }
}
export default connectDB;