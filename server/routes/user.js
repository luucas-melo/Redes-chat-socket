const { saveUserInDB, getUsers } = require('../controllers/userController');
const router = require('express').Router();

router.post('/save', saveUserInDB);
router.get('/getUsers', getUsers);

module.exports = router;
