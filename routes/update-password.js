const router = require('express').Router(); 
const {updatePassword}  = require('../controllers/updateController');
router.post('/:token', updatePassword);
module.exports = router; 