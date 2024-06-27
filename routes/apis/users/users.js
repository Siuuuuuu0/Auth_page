const router = require('express').Router(); 
const getId = require('../../../middleware/getId');
const roles = require('../../../config/roles');
const verifyRoles = require('../../../middleware/verifyRoles'); 
const alreadyExists = require('../../../middleware/userOrMailExists');
const {deleteUser, updateUser, getUsers, createUser, getUser} = require('../../../controllers/users/usersController');
router.route('/')
    .get(getUsers)
    .post(verifyRoles(roles.Admin), alreadyExists, createUser)
    .put(verifyRoles(roles.Admin), getId, alreadyExists, updateUser)
    .delete(verifyRoles(roles.Admin), getId, deleteUser)
router.route('/:id')
    .get(getUser)
module.exports = router; 