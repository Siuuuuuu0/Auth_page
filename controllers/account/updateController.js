const User = require('../../model/User');
const {confirmMail} = require('../../utilities/2FA');
const bcrypt = require('bcrypt');
const handleChangeCredentials = async(req, res)=>{
    const {password, email, username} = req.body.toUpdate;
    const id = req.body.id
    if(!password&&!email&&!username||!id) return res.status(400).message({'message' : 'no update given'});
    const foundUser = await User.findOne({_id : id}).exec();
    if(!foundUser) return res.status(404).json({'message' : 'no such user found'});
    if(username) {
        foundUser.username = username; 
        try {
            await foundUser.save();
        }catch(err){
            if(err.code === 11000)
                return res.status(500).json({'message' : 'username already taken in the meantime'});
            return res.status(500).json({'message' : err.message});
        }
        return res.status(200).json({'message' : 'username updated'});
    }
    if(password||email){
        email?foundUser.newEmail = email : foundUser.newPassword = await bcrypt.hash(password, 10);
        foundUser.save();//parallel saving and email sending
        confirmMail(foundUser.email, email?'/dash/update-email':'/dash/update-password');
        res.status(200).json({'message' : 'confirmation email sent'});
    }
};
const updateEmail = async(req, res)=>{
    if(!req?.body?.email) return res.status(400).json({'message' : 'no id provided'});
    const foundUser = await User.findOne({email}).exec();
    if(!foundUser||!foundUser.newEmail) return res.status(404).json({'message' : 'no such user'}); 
    foundUser.email = foundUser.newEmail;
    foundUser.newEmail = undefined;
    try {
        await foundUser.save();
    }catch(err){
        if(err.code === 11000)
            return res.status(403).json({'message' : 'email already taken in the meantime'});
        return res.status(500).json({'message' : err.message});
    }
    const account = {
        email : foundUser.email, 
        username : foundUser.username, 
        id : foundUser._id
    }
    return res.status(200).json({account});
};
const updatePassword = async(req, res)=>{
    if(!req?.body?.email) return res.status(400).json({'message' : 'no id provided'});
    const foundUser = await User.findOne({email}).exec();
    if(!foundUser||!foundUser.newPassword) return res.status(404).json({'message' : 'no such user'}); 
    foundUser.password = foundUser.newPassword;
    foundUser.newPassword = undefined;
    foundUser.refreshToken = '';
    await foundUser.save();
    const account = {
        email : foundUser.email, 
        username : foundUser.username, 
        id : foundUser._id
    }
    return res.status(200).json({account});
};
module.exports = {handleChangeCredentials, updateEmail, updatePassword};