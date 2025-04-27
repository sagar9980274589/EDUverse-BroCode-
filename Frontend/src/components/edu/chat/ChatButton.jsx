import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { useSelector } from 'react-redux';
import ChatDrawer from './ChatDrawer';
import api from '../../AxiosInstance';

const ChatButton = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [followRequests, setFollowRequests] = useState([]);
  const user = useSelector((state) => state.data.userdata);
  const messages = useSelector((state) => state.chat.messages);

  // Check for unread messages and follow requests
  useEffect(() => {
    // Only run if user is authenticated
    if (!user || !user._id) {
      return;
    }

    const checkUnreadMessages = async () => {
      try {
        // For now, we'll skip this call since the endpoint might not be fully implemented
        // const response = await api.get('/user/unreadmessages');
        // if (response.data.success) {
        //   setHasUnreadMessages(response.data.hasUnread);
        // }
        setHasUnreadMessages(false); // Default to no unread messages for now
      } catch (error) {
        console.error('Error checking unread messages:', error);
        // Don't show error to user, just fail silently
      }
    };

    const checkFollowRequests = async () => {
      try {
        // For now, we'll skip this call since the endpoint might not be fully implemented
        // const response = await api.get('/user/getfollowrequests');
        // if (response.data.success) {
        //   setFollowRequests(response.data.requests);
        // }
        setFollowRequests([]); // Default to no follow requests for now
      } catch (error) {
        console.error('Error checking follow requests:', error);
        // Don't show error to user, just fail silently
      }
    };

    // Check initially and then every minute
    checkUnreadMessages();
    checkFollowRequests();

    const interval = setInterval(() => {
      checkUnreadMessages();
      checkFollowRequests();
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  // Also check when new messages come in
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.senderId !== user._id) {
        setHasUnreadMessages(true);
      }
    }
  }, [messages, user._id]);

  // Reset unread status when drawer is opened
  useEffect(() => {
    if (isDrawerOpen && hasUnreadMessages) {
      setHasUnreadMessages(false);
      // Optionally mark messages as read on the server
      api.post('/user/markread').catch(error => {
        console.error('Error marking messages as read:', error);
      });
    }
  }, [isDrawerOpen, hasUnreadMessages]);

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-6 left-6 bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 transition-colors z-40 flex items-center justify-center"
      >
        <MessageSquare size={24} />
        {(hasUnreadMessages || followRequests.length > 0) && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {followRequests.length > 0 ? followRequests.length : ''}
          </span>
        )}
      </button>

      <ChatDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};

export default ChatButton;
