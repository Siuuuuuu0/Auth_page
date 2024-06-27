const router = require('express').Router();
const handleVerification = require('../../../controllers/auth/verify2FAController');
const verifyForLocation = require('../../../middleware/verifyForLocation'); 
router.post('/', verifyForLocation, handleVerification); 
module.exports = router; 