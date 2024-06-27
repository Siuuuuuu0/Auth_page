const handleGoogleCallback = require('../../../../middleware/googleCallback');
const setAccessTokenCookie = require('../../../../middleware/setAcessTokenCookie');
const router = require('express').Router(); 
router.use('/', handleGoogleCallback, setAccessTokenCookie); 
module.exports = router;  