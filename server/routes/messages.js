const { addMessage, getPrivateMessages } = require('../controllers/messageController');
const router = require('express').Router();

router.post('/addNewMessage', addMessage);
router.get('/getPrivateMessages', getPrivateMessages);

module.exports = router;
