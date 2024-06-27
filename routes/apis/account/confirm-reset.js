const router = require('express').Router(); 
const {resetPassword} = require('../../../controllers/account/resetPasswordController'); 
router.post('/:token', resetPassword);
module.exports = router; 