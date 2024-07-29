const { handleProfilePictureDeletion } = require('../../../controllers/account/profilePictureController');
const router = require('express').Router(); 
router.post('/', handleProfilePictureDeletion)
module.exports = router