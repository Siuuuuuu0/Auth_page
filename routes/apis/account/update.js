const router = require('express').Router(); 
const {handleChangeCredentials}  = require('../../../controllers/account/updateController');
const { deleteUser } = require('../../../controllers/users/usersController');
const getId = require('../../../middleware/getId');
const alreadyExists = require('../../../middleware/userOrMailExists');
const verifyEmail = require('../../../middleware/verifyEmail');
router.route('/')
    .patch(alreadyExists, handleChangeCredentials)
    .delete(getId, deleteUser)
router.use('/update-email', verifyEmail, require('./update-email'));
router.use('/update-password', verifyEmail, require('./update-password'));
module.exports = router; 