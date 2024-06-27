const router = require('express').Router(); 
const {updatePassword}  = require('../../../controllers/account/updateController');
router.post('/:token', updatePassword);
module.exports = router; 