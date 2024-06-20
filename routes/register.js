const router = require('express').Router(); 
const {emailLimiter} = require('../config/rateLimiter');
const handleRegistration = require('../controllers/registrationController'); 
router.post('/confirm-email', emailLimiter, require('./confirm-registration'));
router.post('/', handleRegistration); 
module.exports = router; 