const { createGroup, getGroups } = require('../controllers/groupController');
const router = require('express').Router();

router.post('/createGroup', createGroup);
router.get('/getGroups', getGroups);

module.exports = router;
