import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../chatSlice";

const useChatListener = () => {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
   
      dispatch(addMessage(newMessage)); // Make sure it's only added once
    };

    // Prevent multiple listeners
    socket.off("newMessage", handleNewMessage);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch]);
};

export default useChatListener;
