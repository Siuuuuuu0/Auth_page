const router = require('express').Router();
const handleConfirmation = require('../controllers/emailConfirmationController');
const verifyEmail = require('../middleware/verifyEmail');
router.post('/:token', verifyEmail, handleConfirmation);
module.exports = router;