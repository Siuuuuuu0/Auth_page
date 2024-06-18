const router = require('express').Router(); 
const handleRegistration = require('../controllers/registrationController'); 
router.post('/confirm-email', require('./confirm-email'));
router.post('/', handleRegistration); 
module.exports = router; 