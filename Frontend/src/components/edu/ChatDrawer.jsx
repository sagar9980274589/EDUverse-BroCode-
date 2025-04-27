import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, MessageSquare, User, Send, Check, X as XIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { setSelectedUser } from '../../UserSlice';
import { setMessages } from '../../chatSlice';
import api from '../../AxiosInstance';
import { useForm } from 'react-hook-form';
import useChatListener from '../../hooks/useChatListener';

const ChatDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { handleSubmit, register, reset } = useForm();
  const user = useSelector((state) => state.data.userdata);
  const selectedUser = useSelector((state) => state.data.selectedUser);
  const messages = useSelector((state) => state.chat.messages);
  const onlineUsers = useSelector((state) => state.chat.onlineUsers) || [];

  const [followingUsers, setFollowingUsers] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [followRequests, setFollowRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'requests'

  // Use the chat listener hook
  useChatListener();

  // Fetch following users
  useEffect(() => {
    // Only run if drawer is open and user is authenticated
    if (!isOpen || !user || !user._id) {
      return;
    }

    const fetchFollowingUsers = async () => {
      try {
        // For now, we'll use a simpler approach to get following users
        // This assumes user.following contains the IDs of users being followed
        if (user.following && user.following.length > 0) {
          // Fetch each user's profile
          const followingProfiles = [];
          for (const followingId of user.following) {
            try {
              const response = await api.get(`/user/getothersprofile/${followingId}`);
              if (response.data.success) {
                followingProfiles.push(response.data.user);
              }
            } catch (err) {
              console.error(`Error fetching profile for user ${followingId}:`, err);
            }
          }
          setFollowingUsers(followingProfiles);
        } else {
          setFollowingUsers([]);
        }
      } catch (error) {
        console.error('Error processing following users:', error);
        setFollowingUsers([]);
      }
    };

    const fetchFollowRequests = async () => {
      try {
        // For now, we'll use empty follow requests since the endpoint might not be ready
        setFollowRequests([]);
      } catch (error) {
        console.error('Error fetching follow requests:', error);
        setFollowRequests([]);
      }
    };

    fetchFollowingUsers();
    fetchFollowRequests();
  }, [isOpen, user]);

  // Handle user selection
  const handleUserClick = (userId) => {
    dispatch(setSelectedUser(userId));

    // Fetch user profile and messages
    (async function getUserProfile() {
      try {
        const res = await api.get(`/user/getothersprofile/${userId}`);
        if (res.data.success) {
          setSelectedUserData(res.data.user);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    })();

    // Fetch messages
    (async function getMessages() {
      try {
        const res = await api.get(`/user/getmessages/${userId}`);
        if (res.data.success || res.data.sucess) { // Handle both spellings
          dispatch(setMessages(res.data.messages));
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    })();
  };

  // Send message
  const sendMessage = async (data) => {
    if (!data.message.trim()) return;

    try {
      const response = await api.post(`/user/sendmessage/${selectedUser}`, data);
      if (response.data.success) {
        dispatch(setMessages([...messages, response.data.newMessage]));
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
    reset();
  };

  // Handle follow request response
  const handleFollowRequest = async (userId, accept) => {
    try {
      // For now, we'll just simulate the follow request handling
      // since the backend endpoints might not be fully implemented

      // Remove from requests list
      setFollowRequests(followRequests.filter(request => request._id !== userId));

      // If accepted, add to following list
      if (accept) {
        try {
          const userResponse = await api.get(`/user/getothersprofile/${userId}`);
          if (userResponse.data.success) {
            setFollowingUsers([...followingUsers, userResponse.data.user]);
          }
        } catch (err) {
          console.error(`Error fetching profile for user ${userId}:`, err);
        }
      }

      // Show success message
      toast.success(accept ? 'Follow request accepted' : 'Follow request declined', {
        position: 'top-center',
        autoClose: 3000
      });
    } catch (error) {
      console.error('Error handling follow request:', error);
      toast.error('Failed to process follow request', {
        position: 'top-center',
        autoClose: 3000
      });
    }
  };

  // Format date
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-xl transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <MessageSquare className="text-indigo-600 mr-2" size={20} />
          <h2 className="font-medium text-gray-800">Messages</h2>
          {followRequests.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {followRequests.length}
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'chats' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('chats')}
        >
          Chats
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium relative ${activeTab === 'requests' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('requests')}
        >
          Follow Requests
          {followRequests.length > 0 && (
            <span className="absolute top-1 right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {followRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'chats' ? (
        <>
          {/* User list */}
          <div className="flex-1 overflow-y-auto">
            {followingUsers.length > 0 ? (
              followingUsers.map((followedUser) => (
                <div
                  key={followedUser._id}
                  className={`p-3 flex items-center hover:bg-gray-50 cursor-pointer ${selectedUser === followedUser._id ? 'bg-indigo-50' : ''}`}
                  onClick={() => handleUserClick(followedUser._id)}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {followedUser.profile ? (
                      <img
                        src={followedUser.profile}
                        alt={followedUser.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={16} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-800">{followedUser.username}</p>
                      <span className={`w-2 h-2 rounded-full ${onlineUsers.includes(followedUser._id) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{followedUser.userType || followedUser.role}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p>No users to chat with</p>
                <p className="text-sm mt-1">Follow users to start chatting</p>
              </div>
            )}
          </div>

          {/* Chat area */}
          {selectedUserData && (
            <div className="border-t flex flex-col h-96">
              {/* Selected user header */}
              <div className="p-3 border-b flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {selectedUserData.profile ? (
                    <img
                      src={selectedUserData.profile}
                      alt={selectedUserData.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={14} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="ml-2">
                  <p className="font-medium text-gray-800">{selectedUserData.username}</p>
                  <p className="text-xs text-gray-500">
                    {onlineUsers.includes(selectedUserData._id) ? 'Online' : 'Offline'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    dispatch(setSelectedUser(null));
                    setSelectedUserData(null);
                  }}
                  className="ml-auto text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.length > 0 ? (
                  messages.map((message, index) => (
                    <div
                      key={message._id || index}
                      className={`flex ${message.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          message.senderId === user._id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p>{message.message}</p>
                        <p className={`text-xs mt-1 ${message.senderId === user._id ? 'text-indigo-200' : 'text-gray-500'}`}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>No messages yet</p>
                  </div>
                )}
              </div>

              {/* Message input */}
              <form onSubmit={handleSubmit(sendMessage)} className="p-3 border-t">
                <div className="flex items-center">
                  <input
                    {...register('message')}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white rounded-r-lg px-3 py-2 hover:bg-indigo-700"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      ) : (
        /* Follow Requests Tab */
        <div className="flex-1 overflow-y-auto">
          {followRequests.length > 0 ? (
            followRequests.map((request) => (
              <div key={request._id} className="p-3 border-b">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {request.profile ? (
                      <img
                        src={request.profile}
                        alt={request.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={16} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="font-medium text-gray-800">{request.username}</p>
                    <p className="text-xs text-gray-500">{request.userType || request.role}</p>
                  </div>
                </div>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleFollowRequest(request._id, true)}
                    className="flex-1 bg-indigo-600 text-white rounded-lg py-1 text-sm flex items-center justify-center hover:bg-indigo-700"
                  >
                    <Check size={14} className="mr-1" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleFollowRequest(request._id, false)}
                    className="flex-1 bg-gray-200 text-gray-800 rounded-lg py-1 text-sm flex items-center justify-center hover:bg-gray-300"
                  >
                    <XIcon size={14} className="mr-1" />
                    Decline
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p>No pending follow requests</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatDrawer;
