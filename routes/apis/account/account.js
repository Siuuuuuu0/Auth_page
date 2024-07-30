const router = require('express').Router(); 

router.use('/upload-profile-picture', require('./upload-profile-picture'))
router.use('/delete-profile-picture', require('./delete-profile-picture'))
router.use('/change-profile-picture', require('./change-profile-picture'))
router.use('/get-profile-picture', require('./get-profile-picture'))
module.exports = router