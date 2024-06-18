const User = require('../model/User'); 
const bcrypt = require('bcrypt');
const {mailCode} = require('../utilities/2FA');
const handleAuth = async(req, res)=>{
    const {userOrMail, password} = req.body; 
    const regex = /[a-zA-Z0-9]+$/;
    const isUsername = regex.test(userOrMail);
    const foundUser = await User.findOne(isUsername?{username : userOrMail}:{email : userOrMail}).exec();
    if(!foundUser) return res.status(404).json({'message' : 'no such user'});
    const lockedUntil = foundUser.lockedUntil;
    if(lockedUntil && lockedUntil > Date.now()) return res.status(403)
        .json({'message' : `Account blocked until ${Math.ceil((foundUser.lockedUntil - Date.now()) / 1000)}`});
    else if (lockedUntil) {
        foundUser.lockedUntil = undefined; 
        await foundUser.save();
    }
    const authed = await bcrypt.compare(password, foundUser.password); 
    if(authed) {
        foundUser.failedAttempts = 0;
        await foundUser.save();
        mailCode(foundUser); //async to save time and send the email in a different thread
        return res.status(200).json({'message' : foundUser._id});
    }
    else{
        return res.sendStatus(401);
    }
};
module.exports = handleAuth;