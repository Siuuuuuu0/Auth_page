const router = require('express').Router(); 
const handleAuth = require('../controllers/authController'); 
router.post('/', handleAuth); 
module.exports = router; 