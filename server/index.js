const express = require('express');
const cors = require('cors');
const messageRoutes = require('./routes/messages');
const app = express();
const socket = require('socket.io');
require('dotenv').config();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/messages', messageRoutes);

const server = app.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`));
const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

global.onlineUsers = new Map();
io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('ADD_USER', (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('SEND_MSG', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('RECEIVE_MSG', data.msg);
    }
  });
});
