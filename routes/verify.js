const router = require('express').Router();
const handleVerification = require('../controllers/verify2FAController');
router.post('/', handleVerification); 
module.exports = router; 