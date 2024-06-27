const router = require('express').Router();
const handleConfirmation = require('../../../../controllers/auth/registrationConfirmationController');
const verifyEmail = require('../../../../middleware/verifyEmail');
router.post('/:token', verifyEmail, handleConfirmation);
router.use('/', verifyEmail, handleConfirmation); //google Auth no need for email confirmation
module.exports = router;