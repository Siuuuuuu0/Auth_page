const router = require('express').Router(); 
const registrationController = require('../controllers/registrationController'); 
router.post('/', registrationController.handleRegistration); 
module.exports = router; 