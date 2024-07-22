const router = require('express').Router();
const handleGoogleAuth = require('../../../../controllers/auth/googleAuthController')
// const passport = require('../../../../controllers/auth/googleAuthController');
// router.use('/callback', require('./google-callback')); 
// router.use('/', passport.authenticate('google', { scope:
//     ['email', 'profile']
// }));
router.use('/', handleGoogleAuth)
module.exports = router; 
