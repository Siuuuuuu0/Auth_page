const User = require('../model/User'); 
const bcrypt = require('bcrypt');
const mailCode = require('../utilities/2FA');
const handleAuth = async(req, res)=>{
    const {userOrMail, password} = req.body; 
    const regex = /[a-zA-Z0-9]+$/;
    const isUsername = regex.test(userOrMail);
    const foundUser = await User.findOne(isUsername?{username : userOrMail}:{email : userOrMail}).exec();
    if(!foundUser) return res.status(404).json({'message' : 'no such user'});
    const authed = await bcrypt.compare(password, foundUser.password); 
    if(authed) {
        await mailCode(foundUser);
        return res.status(200).json({'message' : foundUser._id});
    }
    else{
        return res.sendStatus(401);
    }
};
module.exports = handleAuth;