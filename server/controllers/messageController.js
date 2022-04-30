const Messages = require('../models/Messages');

module.exports = {
  async addMessage(req, res, next) {
    try {
      console.log('MESSAGE', req.body);
      const { from, to, message } = req.body;
      const messageData = await Messages.create({
        message: { text: message },
        users: [from, to],
        sender: from,
      });
      console.log(messageData);
      if (messageData) return res.status(200).json({ messageData });
      else return res.json({ msg: 'Invalid message' });
    } catch (ex) {
      next(ex);
    }
  },
};
