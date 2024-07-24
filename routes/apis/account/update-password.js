const router = require('express').Router(); 
const {updatePassword}  = require('../../../controllers/account/updateController');
router.patch('/', updatePassword);
module.exports = router; 