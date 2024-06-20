const {handleGoogleAuth} = require('../controllers/googleAuthController');
const router = require('express').Router();
router.post('/', handleGoogleAuth); 
router.post('/callback', require('./google-callback')); 
module.exports = router; 
