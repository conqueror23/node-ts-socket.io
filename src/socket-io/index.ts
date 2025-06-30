import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import cors from "cors"

const app = express();
app.use(cors())
const server = createServer(app);
const io = new Server(server,
  {
    cors: {
      origin: "http://localhost:3001", // Replace with your client's URL
      methods: ["GET", "POST"],
    },
  });
const port = 5005

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('message', (data: string) => {
    console.log("mesage from front-end", data)
    io.emit('response', `Echo: ${data}`);
  });
  socket.on('client-message', (msg) => {
    console.log('Received from client:', msg);
    socket.emit('server-message', `Server received: ${msg}`);
  });
});


io.on("chatMessage", (data) => {
  console.log("message from client", data)
})

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
