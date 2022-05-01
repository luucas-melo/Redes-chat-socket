const express = require('express');
const cors = require('cors');
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/user');
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

const server = app.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`));
const io = socket(server, {
  cors: corsConfig,
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
      socket.to(sendUserSocket).emit('RECEIVE_MSG', data);
    }
  });
});
