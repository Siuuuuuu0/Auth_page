const router = require('express').Router(); 
const {resetPassword} = require('../../../controllers/account/resetPasswordController'); 
router.post('/', resetPassword);
module.exports = router; 