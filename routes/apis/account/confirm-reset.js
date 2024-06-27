const router = require('express').Router(); 
const {resetPassword} = require('../../../controllers/account/resetPasswordController'); 
router.patch('/:token', resetPassword);
module.exports = router; 