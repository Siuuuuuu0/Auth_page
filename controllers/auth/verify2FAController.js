const User = require('../../model/User');
const jwt = require('jsonwebtoken');
const recordLogIns = require('../../utilities/recordLogIns');
const lockAccount = require('../../utilities/lockAccount');
const handleVerification = async(req, res)=> {
    if(!req?.body?.code||!req.body.userOrMail) return res.status(400).json({'message' : 'no code provided'});
    const regex = /[a-zA-Z0-9]+$/;
    const isUsername = regex.test(req.body.userOrMail);
    const foundUser = await User.findOne(isUsername?{username : req.body.userOrMail}:{email : req.body.userOrMail}).exec();
    if(!foundUser) return res.status(404).json({'message' : 'no such user'});
    const match = req.body.code === foundUser.twoFactorCode;
    foundUser.twoFactorCode = null; 
    await foundUser.save();
    if(match) {
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
            {"Info" : {
                "email" : foundUser.email, 
                "roles" : roles,
                "username" : foundUser.username, 
                "id" : foundUser._id
            }}, 
            process.env.ACCESS_TOKEN_SECRET, 
            {expiresIn : '15m'}
        );
        const refreshToken = jwt.sign(
            {
                "email" :foundUser.email, 
                "username" : foundUser.username
            }, 
            process.env.REFRESH_TOKEN_SECRET, 
            {expiresIn : "30d"}
        );
        foundUser.refreshToken = refreshToken;
        foundUser.lastLocation = req.body.location;
        await foundUser.save();
        // req.session.userId = foundUser._id;
        recordLogIns("New log in from ", req, foundUser); //no need for sync work
        // res.cookie('jwt', refreshToken, {httpOnly : true, sameSite : "None", maxAge : 1000*60*60*24});
        res.cookie('jwt', refreshToken, {httpOnly : true, secure :true, sameSite : "None", maxAge : 1000*60*60*24});
        return res.json({accessToken});
    }
    else {
        await lockAccount(foundUser);
        return res.status(401).json({'message' : 'wrong code'});
    }
}; 
module.exports = handleVerification; 