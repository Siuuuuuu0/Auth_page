const router = require('express').Router(); 
const {updateEmail}  = require('../controllers/updateController');
router.post('/:token', updateEmail);
module.exports = router; 