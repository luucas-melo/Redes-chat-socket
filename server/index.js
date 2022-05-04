const express = require('express');
const cors = require('cors');
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group');
const app = express();
const socket = require('socket.io');
const mongoose = require('mongoose');
const Groups = require('./models/Groups');
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

global.groups = new Map();
global.onlineUsers = new Map();
io.on('connection', (socket) => {
  socket.on('ADD_USER', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(onlineUsers);

    for (const [mongoId, socketId] of onlineUsers.entries()) {
      if (mongoId !== userId) {
        socket.to(socketId).emit('USER_CONNECTED', socketId);
      }
    }
  });

  socket.on('SEND_MSG', (group, data) => {
    socket.to(group).emit('RECEIVE_MSG', data);
  });
  socket.on('ADD_GROUP', (groupId) => {
    groups.set(groupId, socket.id);
    // entra em uma sala(room) https://socket.io/docs/v4/rooms/
    socket.join(groupId);
  });

  socket.on('LEAVE_GROUP', (groupId) => {
    socket.leave(groupId);
  });
});
