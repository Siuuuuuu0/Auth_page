const router = require('express').Router(); 
const {emailLimiter} = require('../../../../config/rateLimiter');
const handleRegistration = require('../../../../controllers/auth/registrationController'); 
const alreadyExists = require('../../../../middleware/userOrMailExists')
router.use('/confirm-registration', emailLimiter, require('./confirm-registration'));
router.post('/', alreadyExists, handleRegistration); 
module.exports = router; 