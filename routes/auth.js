const router = require('express').Router(); 
const handleAuth = require('../controllers/authController'); 
const handleGoogleAuth = require('../controllers/googleAuthController');
router.post('/', handleAuth); 
router.post('/google', handleGoogleAuth);
module.exports = router; 