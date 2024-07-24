const router = require('express').Router(); 
const {sendResetMail} = require('../../../controllers/account/resetPasswordController'); 
const verifyEmail = require('../../../middleware/verifyEmail');
router.post('/', sendResetMail); 
router.use('/confirm', verifyEmail, require('./confirm-reset'));
module.exports = router; 