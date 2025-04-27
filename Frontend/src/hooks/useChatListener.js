import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setOnlineUsers } from '../chatSlice';
import socket from '../socket';

const useChatListener = () => {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.data.selectedUser);
  const user = useSelector((state) => state.data.userdata);

  useEffect(() => {
    if (!socket || !user || !user._id) return;

    // Listen for new messages
    const handleNewMessage = (newMessage) => {
      // Add the message to the chat
      dispatch(addMessage(newMessage));
    };

    // Listen for online users updates
    const handleOnlineUsers = (users) => {
      dispatch(setOnlineUsers(users));
    };

    // Set up listeners
    socket.off("newMessage", handleNewMessage); // Prevent duplicates
    socket.on("newMessage", handleNewMessage);

    socket.off("onlineUsers", handleOnlineUsers); // Prevent duplicates
    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [dispatch, user]);

  return null;
};

export default useChatListener;
