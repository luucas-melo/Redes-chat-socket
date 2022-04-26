module.exports = {
  async addMessage(req, res, next) {
    try {
      const { from, to, message } = req.body;

      if (message) return res.status(200).json({ message });
      else return res.json({ msg: 'Invalid message' });
    } catch (ex) {
      next(ex);
    }
  },
};
