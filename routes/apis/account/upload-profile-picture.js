const { handleProfilePictureUpload } = require('../../../controllers/account/profilePictureController');
const router = require('express').Router(); 

router.post('/', handleProfilePictureUpload)
module.exports = router