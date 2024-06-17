const router = require('express').Router(); 
const roles = require('../../config/roles');
const verifyRoles = require('../../middleware/verifyRoles'); 
const {deleteUser, updateUser, getUsers, createUser, getUser} = require('../../controllers/usersController');
router.route('/')
    .get(getUsers)
    .post(verifyRoles(roles.Admin), createUser)
    .put(verifyRoles(roles.Admin), updateUser)
    .delete(verifyRoles(roles.Admin), deleteUser)
router.route('/:id')
    .get(getUser)
module.exports = router; 