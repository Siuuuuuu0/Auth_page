const router = require('express').Router(); 

router.use('/upload-profile-picture', require('./upload-profile-picture'))
module.exports = router