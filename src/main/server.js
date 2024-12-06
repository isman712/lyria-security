import express from 'express';
import http from 'http'
import cors from 'cors'

import { Server } from 'socket.io'



  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);
  app.use(cors());  
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    socket.on('offer', (data) => {
      socket.broadcast.emit('offer', data);
    });
  
    socket.on('answer', (data) => {
      socket.broadcast.emit('answer', data);
    });
  
    socket.on('ice-candidate', (data) => {
      socket.broadcast.emit('ice-candidate', data);
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
  
  const PORT = 3712;
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
export default app;