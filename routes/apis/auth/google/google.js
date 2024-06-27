const router = require('express').Router();
const passport = require('../../../../controllers/googleAuthController');
router.use('/callback', require('./google-callback')); 
router.use('/', passport.authenticate('google', { scope:
    ['email', 'profile']
}));
module.exports = router; 
