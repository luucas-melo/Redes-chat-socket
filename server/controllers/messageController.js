const Groups = require('../models/Groups');
const Users = require('../models/Users');
const { Messages } = require('../models/Messages');

module.exports = {
  async addMessage(req, res, next) {
    try {
      const { from, to, message } = req.body;
      console.log('BODY', req.body);
      const group = await Groups.findById(to);
      const messageData = await Messages.create({
        message: { text: message },
        group: to,
        sender: from,
      });
      group.messages.push(messageData);
      await messageData.save();
      await group.save();
      const messageContent = await messageData.populate({
        path: 'sender',
        model: Users,
      });
      console.log('MENSAGEM', messageData);
      if (messageContent) return res.status(200).json({ messageContent });
      else return res.json({ msg: 'Invalid message' });
    } catch (error) {
      next(error);
    }
    // try {
    //   const { from, to, message } = req.body;
    //   const messageData = await Messages.create({
    //     message: { text: message },
    //     users: [from, to],
    //     sender: from,
    //   });
    //   if (messageData) return res.status(200).json({ messageData });
    //   else return res.json({ msg: 'Invalid message' });
    // } catch (error) {
    //   next(error);
    // }
  },

  async getMessages(req, res, next) {
    try {
      const { from, to, isPrivate } = req.query;
      //   let messages = [];
      //   if (isPrivate.toString() !== 'false') {
      //     messages = await Groups.find({
      //       users: {
      //         $all: [from, to],
      //       },
      //       is_private: true,
      //     }).sort({ updatedAt: 1 });

      //     const privateMessages = messages.map((privateMessage) => {
      //       return {
      //         from: from === privateMessage.sender.toString() ? from : to,
      //         to: to === privateMessage.sender.toString() ? to : from,
      //         message: privateMessage.message.text,
      //       };
      //     });

      //     res.json(privateMessages);
      //   } else {
      //     console.log('TO', req.query);
      //     const group = await Groups.findById({
      //       _id: to,
      //     }).sort({ updatedAt: 1 });

      //     messages = group.messages;

      //     console.log('MESSA', group);
      //     const groupMessages = messages.map((message) => {
      //       return {
      //         from: from === message.sender.toString() ? from : to,
      //         to: group._id,
      //         message: message.message.text,
      //       };
      //     });

      const group = await Groups.findById({
        _id: to,
      }).sort({ updatedAt: 1 });
      const groupMessages = await group.populate({
        path: 'messages.sender',
        model: Users,
      });
      console.log(groupMessages);
      res.json(groupMessages);

      // try {
      //   const { from, to } = req.query;

      //   const messages = await Messages.find({
      //     users: {
      //       $all: [from, to],
      //     },
      //   }).sort({ updatedAt: 1 });

      //   const privateMessages = messages.map((privateMessage) => {
      //     return {
      //       from: from === privateMessage.sender.toString() ? from : to,
      //       to: to === privateMessage.sender.toString() ? to : from,
      //       message: privateMessage.message.text,
      //     };
      //   });

      //   res.json(privateMessages);
    } catch (error) {
      next(error);
    }
  },

  async addMessageInGroup(req, res, next) {
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
};
