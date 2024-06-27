const router = require('express').Router(); 
const handleRefreshToken = require('../../../controllers/auth/refreshTokenController');
router.get('/', handleRefreshToken); 
module.exports = router; 
