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

  /**
   * QUIZ CREATION HANDLER
   * When a user creates a quiz, we generate a quiz ID and store the quiz data
   */
  socket.on('create_quiz', (quizData) => {
    const quizId = Math.random().toString(36).substr(2, 9); // Generate a random quiz ID
    quizzes[quizId] = quizData; // Store the quiz data in memory
    socket.emit('quiz_created', quizId); // Send quiz ID back to the creator
  });

  /**
   * QUIZ JOIN HANDLER
   * When a user joins a quiz, retrieve the quiz data based on quizId
   */
  socket.on('join_quiz', (quizId) => {
    const quiz = quizzes[quizId];
    if (quiz) {
      socket.join(quizId); // User joins the room associated with the quiz
      socket.emit('quiz_data', quiz); // Send the quiz data to the user
    } else {
      socket.emit('error', 'Quiz not found'); // Error handling if quiz is not found
    }
  });

  /**
   * ANSWER SUBMISSION HANDLER
   * When a user submits an answer, check if it is correct and return the result
   */
  socket.on('submit_answer', ({ quizId, answerIndex, questionIndex }) => {
    const quiz = quizzes[quizId];
    if (quiz) {
      const correctAnswer = quiz.questions[questionIndex].correctAnswer;
      const isCorrect = correctAnswer === answerIndex; // Check if the answer is correct
      socket.emit('answer_result', { isCorrect }); // Send the result to the user
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
