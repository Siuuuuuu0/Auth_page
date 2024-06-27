const User = require('../../model/User'); 
const {confirmMail} = require('../../utilities/2FA');
const handleRegistration = async(req, res) => {
    if(!req?.body?.email) res.status(400).json({'message' : 'email required'});
    const {email} = req.body; 
    const duplicateEmail = await User.findOne({email}).exec();
    if(duplicateEmail) return res.status(409).json({'message' : 'this email is already registered'})
    confirmMail(req.body.email, '/register/confirm-registration');
    res.status(200).json({'message' : 'confirmation email sent'});
};
module.exports = handleRegistration;
//confirm email