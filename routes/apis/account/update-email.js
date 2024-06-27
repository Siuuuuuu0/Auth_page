const router = require('express').Router(); 
const {updateEmail}  = require('../../../controllers/account/updateController');
router.post('/:token', updateEmail);
module.exports = router; 