const Users = require('../models/Users');

module.exports = {
  async saveUserInDB(req, res, next) {
    try {
      if (req.body.username) {
        const user = await Users.findOne({ username: req.body.username });
        console.log(user);
        if (user) {
          return res.status(200).json({ msg: 'User already exists', user: user });
        }
        const newUser = new Users({
          username: req.body.username,
          avatar_url: req.body.avatar_url,
          name: req.body.name,
        });
        await newUser.save();
        return res.status(201).json({ msg: 'User created', user: newUser });
      }
    } catch (error) {
      next(error);
    }
  },
};
