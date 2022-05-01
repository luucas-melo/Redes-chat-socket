const Messages = require('../models/Messages');

module.exports = {
  async addMessage(req, res, next) {
    try {
      const { from, to, message } = req.body;
      const messageData = await Messages.create({
        message: { text: message },
        users: [from, to],
        sender: from,
      });
      if (messageData) return res.status(200).json({ messageData });
      else return res.json({ msg: 'Invalid message' });
    } catch (error) {
      next(error);
    }
  },

  async getPrivateMessages(req, res, next) {
    try {
      const { from, to } = req.query;

      const messages = await Messages.find({
        users: {
          $all: [from, to],
        },
      }).sort({ updatedAt: 1 });

      const privateMessages = messages.map((privateMessage) => {
        return {
          from: from === privateMessage.sender.toString() ? from : to,
          to: to === privateMessage.sender.toString() ? to : from,
          message: privateMessage.message.text,
        };
      });

      res.json(privateMessages);
    } catch (error) {
      next(error);
    }
  },
};
