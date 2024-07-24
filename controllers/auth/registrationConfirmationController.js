const bcrypt = require('bcrypt');
const recordLogIns = require('../../utilities/recordLogIns');
const User = require('../../model/User');
const jwt = require('jsonwebtoken')
const handleConfirmation = async(req, res)=>{
    return res.json({email : req.body.email});
}

const handleComplete = async(req, res) =>{
    const {password, email, username, googleId } = req.body; 
    if(!password||!email) return res.status(400).json({'message' : 'password and email required'});
    if(username) {
        const duplicateUsername = await User.findOne({username}).exec();
        if(duplicateUsername) return res.status(409).json({'message' : 'this username already exists'});
    }
    try{
        const hashedPwd = await bcrypt.hash(password, 10);
        const result = await User.create({
        password :hashedPwd, 
        email :email, 
        username : username?username:email //if username exists then username, else the email
        });
        if (googleId) result.googleId = googleId
        const accessToken = jwt.sign(
            {"Info" : {
                "email" : result.email, 
                "roles" : Object.values(result.roles),
                "username" : result.username, 
                "id" : result._id
            }}, 
            process.env.ACCESS_TOKEN_SECRET, 
            {expiresIn : '15m'}
        );
        const refreshToken = jwt.sign(
            {
                "email" :result.email, 
                "username" : result.username
            }, 
            process.env.REFRESH_TOKEN_SECRET, 
            {expiresIn : "30d"}
        );
        result.refreshToken = refreshToken
        await result.save();
        // console.log(result);
        recordLogIns("First log in from ", req, result);
        // return res.status(201).json({'message' : `User ${result} has been created`});
        res.cookie('jwt', refreshToken, {httpOnly : true, secure :true, sameSite : "None", maxAge : 1000*60*60*24});
        return res.json({accessToken});
        
    }
    catch(err){
        console.log(err)
        if(err.code===11000) 
            return res.status(403).json({'message' : 'username, email or googleId taken in the meantime'});
        return res.status(500).json({'message' : err.message}); 
    }
}
module.exports = {handleConfirmation, handleComplete}; 