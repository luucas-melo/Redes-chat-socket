const { addMessage, getMessages } = require('../controllers/messageController');
const router = require('express').Router();

router.post('/addNewMessage', addMessage);
router.get('/getMessages', getMessages);

module.exports = router;
