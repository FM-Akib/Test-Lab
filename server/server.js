const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"], // Allow React front-end ports
    methods: ["GET", "POST"],
  }
});

app.use(cors());
app.use(express.json());

// Store quizzes in memory for simplicity
let quizzes = {};

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

 // Handle quiz creation
 socket.on('create_quiz', (quizData) => {
  const quizId = Math.random().toString(36).substr(2, 9); // Generate a random quiz ID
  const roomName = quizData.roomName;
  quizzes[quizId] = { ...quizData, roomName }; // Store the quiz with roomName

  const shareableLink = `http://localhost:5173/quiz/${quizId}?room=${roomName}`;
  socket.emit('quiz_created', { quizId, shareableLink }); // Send the shareable link back to the creator
});

// Handle quiz join
socket.on('join_quiz', ({ quizId, room }) => {
  const quiz = quizzes[quizId];
  if (quiz && quiz.roomName === room) {
    socket.join(quizId);
    socket.emit('quiz_data', quiz);
  } else {
    socket.emit('error', 'Quiz not found or wrong room name');
  }
});

// Handle quiz answer submission
socket.on('submit_answer', ({ quizId, room, answerIndex, questionIndex }) => {
  const quiz = quizzes[quizId];
  if (quiz) {
    const correctAnswer = quiz.questions[questionIndex].correctAnswer;
    const isCorrect = correctAnswer === answerIndex;
    socket.emit('answer_result', { isCorrect });
  }
});

















  /**
   * CHAT FUNCTIONALITY
   * Join room and send/receive messages in the chat
   */
  socket.on('join_room', (data) => {
    const { nickname, room } = data;
    socket.join(room); // User joins the specified room
    console.log(`${nickname} joined room: ${room}`);
  });

  socket.on('send_message', (data) => {
    console.log('Message received:', data);
    io.to(data.room).emit('receive_message', data); // Broadcast the message to the room
  });

  /**
   * DISCONNECTION HANDLER
   * When a user disconnects, log the disconnection
   */
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
server.listen(5000, () => {
  console.log('Server running on port 5000');
});
