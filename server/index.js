const express = require('express');
const cors = require('cors');
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group');
const app = express();
const socket = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const corsConfig = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsConfig));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);

const server = app.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`));
const io = socket(server, {
  cors: corsConfig,
});

global.onlineUsers = new Map();
global.groups = new Map();
io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('ADD_USER', (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('SEND_MSG', (group, data) => {
    if (group) {
      console.log('SEND SUCE', groups, data);
      socket.to(group).emit('RECEIVE_MSG', data);
    }
  });

  socket.on('ADD_GROUP', (groupId) => {
    groups.set(groupId, socket.id);
    console.log('JOVO S GRI', groups);
    socket.join(groupId);
    console.log('GROUPID', groups, groupId);
  });

  socket.on('SEND_GROUP_MESSAGE', (data) => {
    const groupSocket = groups.get(data.to);
    console.log('GRUPO', groupSocket);
    console.log('DATA', data);
    if (groupSocket) {
      socket.to(groupSocket).emit('RECEIVE_MSG', data);
    }
  });
});
