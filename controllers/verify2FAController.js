const User = require('../model/User');
const jwt = require('jsonwebtoken');
const recordLogIns = require('../utilities/recordLogIns');
const handleVerification = async(req, res)=> {
    if(!req?.body?.code||!req.body.id) return res.status(400).json({'message' : 'no code provided'});
    const foundUser = await User.findOne({_id : req.body.id}).exec(); 
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
                "username" : foundUser.username
            }}, 
            process.env.ACCESS_TOKEN_SECRET, 
            {expiresIn : '30s'}
        );
        const refreshToken = jwt.sign(
            {
                "email" :foundUser.email
            }, 
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
    else return res.status(401).json({'message' : 'wrong code'});
}; 
module.exports = handleVerification; 