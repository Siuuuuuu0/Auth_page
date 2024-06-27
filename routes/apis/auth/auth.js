const router = require('express').Router(); 
const handleAuth = require('../controllers/authController'); 
router.post('/', handleAuth); 
router.use('/google', require('./google')); //verifyForLocation
module.exports = router; 