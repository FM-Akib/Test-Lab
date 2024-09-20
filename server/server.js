const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"], // Allow your React front-end ports
    methods: ["GET", "POST"]
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Listen for user joining a room
  socket.on('join_room', (data) => {
    const { nickname, room } = data;
    socket.join(room);
    console.log(`${nickname} joined room: ${room}`);
  });

  // Listen for messages and broadcast them to the room
  socket.on('send_message', (data) => {
    console.log('Message received:', data);
    io.to(data.room).emit('receive_message', data); // Broadcast to the room
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
