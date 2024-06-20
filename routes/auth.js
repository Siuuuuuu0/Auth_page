const router = require('express').Router(); 
const handleAuth = require('../controllers/authController'); 
const verifyForLocation = require('../middleware/verifyForLocation');
router.post('/', handleAuth); 
router.post('/google', verifyForLocation, require('./google'));
module.exports = router; 