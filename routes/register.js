const router = require('express').Router(); 
const handleRegistration = require('../controllers/registrationController'); 
router.post('/', handleRegistration); 
module.exports = router; 