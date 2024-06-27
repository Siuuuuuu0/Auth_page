const router = require('express').Router(); 
const {updateEmail}  = require('../../../controllers/account/updateController');
router.patch('/:token', updateEmail);
module.exports = router; 