const router = require('express').Router();
const handleVerification = require('../controllers/verify2FAController');
const verifyForLocation = require('../middleware/verifyForLocation'); 
router.post('/', verifyForLocation, handleVerification); 
module.exports = router; 