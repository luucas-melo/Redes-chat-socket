const Groups = require('../models/Groups');

module.exports = {
  async createGroup(req, res, next) {
    try {
      if (req.body.name && req.body.users.length > 0) {
        const newGroup = new Groups({ users: req.body.users, name: req.body.name, is_private: req.body.isPrivate });
        await newGroup.save();
        return res.status(201).json({ msg: 'Group created', group: newGroup });
      }
    } catch (error) {
      next(error);
    }
  },

  async getGroups(req, res, next) {
    try {
      const groups = await Groups.find({ users: req.query.id }).populate(['users']); // find by logged user id
      return res.json(groups);
    } catch (error) {
      next(error);
    }
  },
};
