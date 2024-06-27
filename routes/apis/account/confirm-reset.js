const router = require('express').Router(); 
const {resetPassword} = require('../controllers/resetPasswordController'); 
router.post('/:token', resetPassword);
module.exports = router; 