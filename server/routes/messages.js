const { addMessage } = require('../controllers/messageController');
const router = require('express').Router();

router.post('/add-new-message', addMessage);

module.exports = router;
