import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    onlineUsers: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload; // Set messages initially
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload); // Add a new message
    },
    setOnlineUsers: (state, action) => {
      
      state.onlineUsers = action.payload;
     
    },
  },
});

export const { setMessages, addMessage, setOnlineUsers } = chatSlice.actions;
export default chatSlice.reducer;
