const router = require('express').Router(); 
const handleLogout = require('../../../controllers/account/logoutController'); 
router.post('/', handleLogout); 
module.exports = router; 