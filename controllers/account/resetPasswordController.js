const User = require('../../model/User'); 
const bcrypt = require('bcrypt'); 
const {confirmMail} = require('../../utilities/2FA'); 
const sendResetMail = async(req, res)=>{
    const userOrMail = req.body.userOrMail;
    if (!userOrMail) return res.status(400).json({ 'message': 'no credential provided' });
    const regex = /[a-zA-Z0-9]+$/;
    const isUsername = regex.test(userOrMail);
    const foundUser = await User.findOne(isUsername ? { username: userOrMail } : { email: userOrMail }).exec();
    confirmMail(foundUser.email, '/confirm-reset');
    res.status(200).json({'message' : 'email sent'});
};
const resetPassword = async(req, res)=>{
    if(!req?.body?.email||!req.body.password) return res.status(400).json({'message' : 'no credentials provided'}); 
    const foundUser = await User.findOne({email : req.body.email}).exec(); 
    if(!foundUser) return res.status(404).json({'message' : 'no such user found'});
    foundUser.password = await bcrypt.hash(req.body.password, 10);  
    foundUser.refreshToken = undefined; 
    await foundUser.save();
    res.status(200).json({'message' : 'password reset, please log-in again'}); 
}; 
module.exports = {resetPassword, sendResetMail}; 