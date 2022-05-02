const mongoose = require('mongoose');
const { MessageSchema } = require('./Messages');
const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },

  messages: [MessageSchema],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
  ],
  is_private: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Groups', groupSchema);
