const handleGoogleCallback = require('../../../../middleware/googleCallback');
const setAccessTokenCookie = require('../../../../middleware/setAcessTokenCookie');
const verifyForLocation = require('../../../../middleware/verifyForLocation');
const router = require('express').Router(); 
router.use('/', handleGoogleCallback, verifyForLocation, setAccessTokenCookie); 
module.exports = router;  