const User = require('../model/User');
const {confirmMail} = require('../utilities/2FA');
const bcrypt = require('bcrypt');
const handleChangeCredentials = async(req, res)=>{
    const {password, email, username, id} = req.body;
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
        confirmMail(foundUser.email, email?'/update/update-email':'/update/update-password');
        res.status(200).json({'message' : 'confirmation email sent'});
    }
};
const updateEmail = async(req, res)=>{
    if(!req?.body?.id) return res.status(400).json({'message' : 'no id provided'});
    const foundUser = await User.findOne({_id : req.body.id}).exec();
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
    return res.status(200).json({'message' : 'email changed'});
};
const updatePassword = async(req, res)=>{
    if(!req?.body?.id) return res.status(400).json({'message' : 'no id provided'});
    const foundUser = await User.findOne({_id : req.body.id}).exec();
    if(!foundUser||!foundUser.newPassword) return res.status(404).json({'message' : 'no such user'}); 
    foundUser.password = foundUser.newPassword;
    foundUser.newPassword = undefined;
    await foundUser.save();
    return res.status(200).json({'message' : 'password changed'});
};
module.exports = {handleChangeCredentials, updateEmail, updatePassword};