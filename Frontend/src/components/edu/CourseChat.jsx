import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Send, 
  User, 
  Users, 
  MessageSquare, 
  X, 
  ChevronDown, 
  ChevronUp,
  Clock
} from 'lucide-react';
import io from 'socket.io-client';

// Initialize socket connection
const socket = io('http://localhost:3000');

const CourseChat = ({ courseId, courseName, mentor }) => {
  const user = useSelector((state) => state.data.userdata);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch messages when component mounts or courseId changes
  useEffect(() => {
    if (courseId) {
      fetchMessages();
      joinCourseRoom();
    }

    return () => {
      if (courseId) {
        leaveCourseRoom();
      }
    };
  }, [courseId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket event listeners
  useEffect(() => {
    // Listen for new messages
    socket.on('course-message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    // Listen for online users updates
    socket.on('course-online-users', (users) => {
      setOnlineUsers(users);
    });

    // Listen for participant updates
    socket.on('course-participants', (users) => {
      setParticipants(users);
    });

    return () => {
      socket.off('course-message');
      socket.off('course-online-users');
      socket.off('course-participants');
    };
  }, []);

  const joinCourseRoom = () => {
    if (user && courseId) {
      socket.emit('join-course-room', { 
        userId: user._id, 
        username: user.username,
        fullname: user.fullname,
        profile: user.profile,
        userType: user.userType,
        courseId 
      });
    }
  };

  const leaveCourseRoom = () => {
    if (user && courseId) {
      socket.emit('leave-course-room', { 
        userId: user._id, 
        courseId 
      });
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:3000/course/${courseId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching course messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      const messageData = {
        courseId,
        message: newMessage,
        senderId: user._id,
        senderName: user.username,
        senderType: user.userType,
        senderProfile: user.profile
      };
      
      // Emit the message to socket server
      socket.emit('course-message', messageData);
      
      // Also save to database
      await axios.post(
        `http://localhost:3000/course/${courseId}/messages`,
        { message: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleParticipants = () => {
    setShowParticipants(!showParticipants);
  };

  // If user is not enrolled or not the mentor, don't show chat
  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Chat Icon Button */}
      {!isOpen && (
        <button 
          onClick={toggleChat}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`bg-white rounded-lg shadow-xl w-80 md:w-96 transition-all ${isMinimized ? 'h-14' : 'h-[500px]'}`}>
          {/* Chat Header */}
          <div className="bg-indigo-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <MessageSquare size={20} className="mr-2" />
              <h3 className="font-medium">{courseName} Chat</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={minimizeChat} className="text-white hover:text-indigo-200">
                {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <button onClick={toggleChat} className="text-white hover:text-indigo-200">
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Participants Toggle */}
              <div className="border-b border-gray-200">
                <button 
                  onClick={toggleParticipants}
                  className="w-full p-2 text-left flex items-center justify-between text-sm text-gray-700 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <Users size={16} className="mr-2 text-indigo-500" />
                    <span>Participants ({participants.length})</span>
                  </div>
                  {showParticipants ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Participants List */}
              {showParticipants && (
                <div className="max-h-32 overflow-y-auto border-b border-gray-200 bg-gray-50">
                  <div className="p-2">
                    <div className="flex items-center p-2 rounded-md bg-indigo-50">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-100 mr-2 flex items-center justify-center">
                        {mentor.profile ? (
                          <img 
                            src={mentor.profile} 
                            alt={mentor.fullname} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={16} className="text-indigo-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{mentor.fullname}</p>
                        <p className="text-xs text-indigo-600">Mentor</p>
                      </div>
                      <div className="ml-auto">
                        <span className={`inline-block w-2 h-2 rounded-full ${onlineUsers.includes(mentor._id) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      </div>
                    </div>
                  </div>
                  {participants
                    .filter(p => p.userType === 'student')
                    .map(participant => (
                      <div key={participant.userId} className="flex items-center p-2 hover:bg-gray-100">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2 flex items-center justify-center">
                          {participant.profile ? (
                            <img 
                              src={participant.profile} 
                              alt={participant.fullname} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={16} className="text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm">{participant.fullname}</p>
                          <p className="text-xs text-gray-500">Student</p>
                        </div>
                        <div className="ml-auto">
                          <span className={`inline-block w-2 h-2 rounded-full ${onlineUsers.includes(participant.userId) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 p-3 overflow-y-auto h-[320px]">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageSquare size={40} className="mb-2 text-gray-300" />
                    <p>No messages yet</p>
                    <p className="text-sm">Be the first to send a message!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`mb-3 flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.senderId !== user._id && (
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2 flex-shrink-0">
                          {msg.senderProfile ? (
                            <img 
                              src={msg.senderProfile} 
                              alt={msg.senderName} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300">
                              <User size={16} className="text-gray-500" />
                            </div>
                          )}
                        </div>
                      )}
                      <div className={`max-w-[70%] ${msg.senderId === user._id ? 'order-1' : 'order-2'}`}>
                        {msg.senderId !== user._id && (
                          <p className="text-xs text-gray-500 mb-1">
                            {msg.senderName}
                            {msg.senderType === 'mentor' && (
                              <span className="ml-1 text-indigo-600 font-medium">(Mentor)</span>
                            )}
                          </p>
                        )}
                        <div className={`p-2 rounded-lg ${
                          msg.senderId === user._id 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'bg-gray-100 text-gray-800 rounded-tl-none'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <Clock size={10} className="mr-1" />
                          {formatTime(msg.timestamp || new Date())}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white p-2 rounded-r-lg hover:bg-indigo-700"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseChat;
