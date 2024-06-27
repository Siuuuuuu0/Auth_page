const User = require('../../model/User'); 
const bcrypt = require('bcrypt'); 
const {confirmMail} = require('../../utilities/2FA'); 
const sendResetMail = async(req, res)=>{
    if(!req?.body?.id) return res.status(400).json({'message' : 'no id provided'}); 
    const foundUser = await User.findOne({_id : req.body.id}).exec(); 
    confirmMail(foundUser.email, '/reset/confirm');
    res.status(200).json({'message' : 'email sent'});
};
const resetPassword = async(req, res)=>{
    if(!req?.body?.email||!req.body.password) return res.status(400).json({'message' : 'no email provided'}); 
    const foundUser = await User.findOne({email : req.body.email}).exec(); 
    if(!foundUser) return res.status(404).json({'message' : 'no such user found'});
    foundUser.password = await bcrypt.hash(req.body.password, 10);  
    foundUser.refreshToken = undefined; 
    await foundUser.save();
    res.status(200).json({'message' : 'password reset, please log-in again'}); 
}; 
module.exports = {resetPassword, sendResetMail}; 