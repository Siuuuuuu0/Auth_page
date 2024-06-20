const router = require('express').Router();
const handleConfirmation = require('../controllers/registrationConfirmationController');
const verifyEmail = require('../middleware/verifyEmail');
router.post('/:token', verifyEmail, handleConfirmation);
router.post('/', handleConfirmation); //google Auth no need for email confirmation
module.exports = router;