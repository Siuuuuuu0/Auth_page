const router = require('express').Router();
const passport = require('../../../../controllers/auth/googleAuthController');
router.get('/callback', require('./google-callback')); 
router.get('/', passport.authenticate('google', { scope:
    ['email', 'profile']
}));
module.exports = router; 
