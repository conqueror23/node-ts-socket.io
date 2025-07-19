import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:8081" || "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 5005;

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.emit("connected", { id: socket.id, message: "Successfully connected to server" });

  socket.on('message', (data: string) => {
    console.log("Message from front-end:", data);
    io.emit('response', `Echo: ${data}`);
  });

  socket.on('client-message', (msg: string) => {
    console.log('Received from client:', msg);
    socket.emit('server-message', `Server received: ${msg}`);
  });

  socket.on('chatMessage', (data: string) => {
    console.log("Chat message from client:", data);
    socket.broadcast.emit('chatMessage', data);
  });

  socket.on('disconnect', (reason: string) => {
    console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
  });

  socket.on('error', (error: Error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

server.on('error', (error: Error) => {
  console.error('Server error:', error);
});

server.listen(port, () => {
  console.log(`Socket.IO server running on http://localhost:${port}`);
});
