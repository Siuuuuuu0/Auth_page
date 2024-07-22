const router = require('express').Router();
const {handleComplete} = require('../../../../controllers/auth/registrationConfirmationController');
router.post('/', handleComplete);
module.exports = router;