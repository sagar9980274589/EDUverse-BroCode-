import Message from "../model/message.model.js";
import Converstaion from "../model/converstaion.model.js";
import { io } from "../index.js";
import { getsocketid } from "../index.js";
import mongoose from 'mongoose';

// Send message function
export const sendmessage = async (req, res) => {
  try {
    const senderId = req.id; 
    const receiverId = req.params.receiverId;
    const { message } = req.body;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ success: false, message: "Invalid sender or receiver ID" });
    }

    // Check if a conversation already exists between the sender and receiver
    let conversation = await Converstaion.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = await Converstaion.create({
        participants: [senderId, receiverId]
      });
    }

    // Create a new message
   
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message
    });

    // Add the new message to the conversation
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // Save both the message and the conversation
    await Promise.all([conversation.save(), newMessage.save()]);

    // Retrieve the receiver's socket ID to emit the new message
    const receiverSocketId = getsocketid(receiverId);

    if (receiverSocketId) {
    
  
        io.to(receiverSocketId).emit("newMessage", newMessage);
        
     
       
    } else {
      console.log("Receiver socket ID not found!");
    }

    return res.status(200).json({ success: true, newMessage });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};

// Get messages function
export const getmessage = async (req, res) => {
  try {
    const senderId = req.id; // Make sure this value is properly set (i.e., from authenticated user)
    const receiverId = req.params.receiverId;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ success: false, message: "Invalid sender or receiver ID" });
    }

    // Find the conversation between the sender and receiver and populate the messages
    const conversation = await Converstaion.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate('messages');

    if (!conversation) {
      return res.status(200).json({ success: true, messages: [] });
    }

    // Return the messages in the conversation
    return res.status(200).json({ success: true, messages: conversation.messages });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};
