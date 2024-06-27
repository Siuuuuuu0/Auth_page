const router = require('express').Router(); 
const handleAuth = require('../../../controllers/auth/authController'); 
router.post('/', handleAuth); 
router.use('/google', require('./google')); 
module.exports = router; 