import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Store online users
  const onlineUsers = new Set();
  
  // Store course rooms and participants
  const courseRooms = new Map(); // courseId -> Set of user objects

  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    
    // Add user to online users
    onlineUsers.add(socket.userId);
    
    // Broadcast online users
    io.emit('online-users', Array.from(onlineUsers));
    
    // Handle joining a course room
    socket.on('join-course-room', (data) => {
      const { userId, username, fullname, profile, userType, courseId } = data;
      
      // Join the course room
      socket.join(`course:${courseId}`);
      
      // Add user to course participants
      if (!courseRooms.has(courseId)) {
        courseRooms.set(courseId, new Map());
      }
      
      courseRooms.get(courseId).set(userId, {
        userId,
        username,
        fullname,
        profile,
        userType,
        socketId: socket.id
      });
      
      // Broadcast updated participants list to the course room
      io.to(`course:${courseId}`).emit(
        'course-participants', 
        Array.from(courseRooms.get(courseId).values())
      );
      
      // Broadcast online users in the course
      io.to(`course:${courseId}`).emit(
        'course-online-users',
        Array.from(courseRooms.get(courseId).keys())
      );
      
      console.log(`User ${userId} joined course room ${courseId}`);
    });
    
    // Handle leaving a course room
    socket.on('leave-course-room', (data) => {
      const { userId, courseId } = data;
      
      // Leave the course room
      socket.leave(`course:${courseId}`);
      
      // Remove user from course participants
      if (courseRooms.has(courseId)) {
        courseRooms.get(courseId).delete(userId);
        
        // If no participants left, remove the course room
        if (courseRooms.get(courseId).size === 0) {
          courseRooms.delete(courseId);
        } else {
          // Broadcast updated participants list to the course room
          io.to(`course:${courseId}`).emit(
            'course-participants', 
            Array.from(courseRooms.get(courseId).values())
          );
          
          // Broadcast online users in the course
          io.to(`course:${courseId}`).emit(
            'course-online-users',
            Array.from(courseRooms.get(courseId).keys())
          );
        }
      }
      
      console.log(`User ${userId} left course room ${courseId}`);
    });
    
    // Handle course messages
    socket.on('course-message', (data) => {
      const { courseId, message, senderId, senderName, senderType, senderProfile } = data;
      
      // Create message object
      const messageObj = {
        courseId,
        message,
        senderId,
        senderName,
        senderType,
        senderProfile,
        timestamp: new Date()
      };
      
      // Broadcast message to the course room
      io.to(`course:${courseId}`).emit('course-message', messageObj);
      
      console.log(`Message sent in course ${courseId} by ${senderId}: ${message}`);
    });
    
    // Handle private messages
    socket.on('private-message', (data) => {
      const { to, message } = data;
      
      // Find the recipient's socket
      const recipientSocket = Array.from(io.sockets.sockets.values())
        .find(s => s.userId === to);
      
      if (recipientSocket) {
        // Send message to recipient
        recipientSocket.emit('private-message', {
          from: socket.userId,
          message
        });
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      
      // Remove user from online users
      onlineUsers.delete(socket.userId);
      
      // Broadcast online users
      io.emit('online-users', Array.from(onlineUsers));
      
      // Remove user from all course rooms
      for (const [courseId, participants] of courseRooms.entries()) {
        if (participants.has(socket.userId)) {
          participants.delete(socket.userId);
          
          // If no participants left, remove the course room
          if (participants.size === 0) {
            courseRooms.delete(courseId);
          } else {
            // Broadcast updated participants list to the course room
            io.to(`course:${courseId}`).emit(
              'course-participants', 
              Array.from(participants.values())
            );
            
            // Broadcast online users in the course
            io.to(`course:${courseId}`).emit(
              'course-online-users',
              Array.from(participants.keys())
            );
          }
        }
      }
    });
  });

  return io;
};

export default initializeSocket;
