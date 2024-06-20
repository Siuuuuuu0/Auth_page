const {handleGoogleCallback} = require('../controllers/googleAuthController');
const router = require('express').Router(); 
router.post('./', handleGoogleCallback); 
module.exports = router;  