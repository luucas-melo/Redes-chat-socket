const { saveUserInDB } = require('../controllers/userController');
const router = require('express').Router();

router.post('/save', saveUserInDB);

module.exports = router;
