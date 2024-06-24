const router = require('express').Router(); 
const {emailLimiter} = require('../config/rateLimiter');
const handleRegistration = require('../controllers/registrationController'); 
router.use('/confirm-registration', emailLimiter, require('./confirm-registration'));
router.post('/', handleRegistration); 
module.exports = router; 