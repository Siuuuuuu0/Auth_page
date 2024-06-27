const router = require('express').Router(); 
const {updatePassword}  = require('../../../controllers/account/updateController');
router.patch('/:token', updatePassword);
module.exports = router; 