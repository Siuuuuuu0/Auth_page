const router = require('express').Router(); 
const handleAuth = require('../controllers/authController'); 
router.post('/', handleAuth); 
router.post('/google', require('./google'));
module.exports = router; 