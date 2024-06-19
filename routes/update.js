const router = require('express').Router(); 
const {handleChangeCredentials}  = require('../controllers/updateController');
const alreadyExists = require('../middleware/userOrMailExists');
const verifyEmail = require('../middleware/verifyEmail');
router.post('/', alreadyExists, handleChangeCredentials);
router.post('/update-email', verifyEmail, require('./update-email'));
router.post('/update-password', verifyEmail, require('./update-password'));
module.exports = router; 