import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';

import http from 'http';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, // Fix 'Credential' to 'credentials'
}));

// Routes
import userRoute from './route/user.route.js';
import courseRoute from './route/course.route.js';
import courseMessageRoute from './route/courseMessage.route.js';
import passwordRoute from './route/password.route.js';
import commentRoute from './route/comment.route.js';
import codingChallengeRoute from './route/coding_challenge.route.js';
import projectStreakRoute from './route/project_streak.route.js';
import learningStreakRoute from './route/learning_streak.route.js';
import userSearchRoute from './route/user_search.route.js';

app.use('/user', userRoute);
app.use('/course', courseRoute);
app.use('/course', courseMessageRoute);
app.use('/password', passwordRoute);
app.use('/comment', commentRoute);
app.use('/coding', codingChallengeRoute);
app.use('/projects', projectStreakRoute);
app.use('/learning', learningStreakRoute);
app.use('/search', userSearchRoute);

// Root route for testing
app.get('/', (req, res) => {
  res.send("Hello, world!");
});

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true, // Enable credentials
  }
});

const userSocketMap = {}; // Store userId to socketId mappings
export const getsocketid = (receiverId) => {
  return userSocketMap[receiverId];
};

// Store course rooms and participants
const courseRooms = new Map(); // courseId -> Map of userId -> user data

// Handle socket connections
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit('getonlineusers', Object.keys(userSocketMap));
  } else {
    console.log('User connected without userId!');
  }

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

  // Handle disconnection
  socket.on('disconnect', () => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      delete userSocketMap[userId];  // Remove user from map
      io.emit('getonlineusers', Object.keys(userSocketMap));

      // Remove user from all course rooms
      for (const [courseId, participants] of courseRooms.entries()) {
        if (participants.has(userId)) {
          participants.delete(userId);

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
    } else {
      console.log('Disconnected socket has no associated userId!');
    }
  });

  // Handle disconnecting by ID
  socket.on('disconnectById', (targetSocketId) => {
    if (io.sockets.sockets.has(targetSocketId)) {
      io.sockets.sockets.get(targetSocketId).disconnect();
      console.log(`Socket with ID ${targetSocketId} has been disconnected`);
    } else {
      console.log(`No socket found with ID ${targetSocketId}`);
    }
  });
});

// Start server
const port = process.env.PORT || 3000;  // Fallback to port 3000 if not defined in .env
server.listen(port, () => {
  connectDB();  // Connect to DB
  console.log(`Server running on port ${port}`);
});

export {io}