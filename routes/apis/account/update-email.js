const router = require('express').Router(); 
const {updateEmail}  = require('../../../controllers/account/updateController');
router.patch('/', updateEmail);
module.exports = router; 