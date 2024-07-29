const { handleProfilePictureChange } = require('../../../controllers/account/profilePictureController');
const router = require('express').Router(); 

router.post('/', handleProfilePictureChange)
module.exports = router