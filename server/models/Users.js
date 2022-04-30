const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: false,
    unique: true,
  },
  avatar_url: {
    type: String,
    required: false,
    unique: true,
  },
});

module.exports = mongoose.model('Users', userSchema);
