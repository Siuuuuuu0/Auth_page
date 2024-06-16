const User = require('../model/User'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const recordLogIns = require('../middleware/recordLogIns');
const handleAuth = async(req, res)=>{
    const {userOrMail, password} = req.body; 
    const regex = /[a-zA-Z0-9]+$/;
    const isUsername = regex.test(userOrMail);
    const foundUser = await User.findOne(isUsername?{username : userOrMail}:{email : userOrMail}).exec();
    if(!foundUser) return res.status(404).json({'message' : 'no such user'});
    const authed = await bcrypt.compare(password, foundUser.password); 
    if(authed) {
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
            {"Info" : {
                "email" : foundUser.email, 
                "roles" : roles
            }}, 
            process.env.ACCESS_TOKEN_SECRET, 
            {expiresIn : '30s'}
        );
        const refreshToken = jwt.sign(
            {"email" :foundUser.email}, 
            process.env.REFRESH_TOKEN_SECRET, 
            {expiresIn : "1d"}
        );
        foundUser.refreshToken = refreshToken;
        await foundUser.save();
        await recordLogIns("New log in from ", req, foundUser);
        res.cookie('jwt', refreshToken, {httpOnly : true, sameSite : "None", maxAge : 1000*60*60*24});
        // res.cookie('jwt', refreshToken, {httpOnly : true, secure :true, sameSite : "None", maxAge : 1000*60*60*24});
        return res.json({accessToken});
    }
    else{
        return res.sendStatus(401);
    }
};
module.exports = handleAuth;