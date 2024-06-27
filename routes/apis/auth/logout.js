const router = require('express').Router(); 
const handleLogout = require('../../../controllers/account/logoutController'); 
router.get('/', handleLogout); 
module.exports = router; 