const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
  },

  {
    timestamps: true,
  }
);
module.exports = {
  MessageSchema,
  Messages: mongoose.model('Messages', MessageSchema),
};
