const { handleGetProfilePicture } = require('../../../controllers/account/profilePictureController');
const router = require('express').Router(); 

router.post('/', handleGetProfilePicture)
module.exports = router