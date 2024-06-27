const router = require('express').Router(); 
const {handleChangeCredentials}  = require('../../../controllers/account/updateController');
const alreadyExists = require('../../../middleware/userOrMailExists');
const verifyEmail = require('../../../middleware/verifyEmail');
router.patch('/', alreadyExists, handleChangeCredentials);
router.patch('/update-email', verifyEmail, require('./update-email'));
router.patch('/update-password', verifyEmail, require('./update-password'));
module.exports = router; 