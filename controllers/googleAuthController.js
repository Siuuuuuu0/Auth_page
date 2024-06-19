const passport = require('passport'); 
const GoogleStrategy = require('passport-google-oauth20').Strategy; 
const User = require('../model/User');
const handleGoogleAuth = async(req, res)=>{
    passport.use(new GoogleStrategy({
        clientID : process.env.GOOGLE_CLIENT_ID, 
        clientSecret : process.env.CLIENT_SECRET,
        callbackURL : "/auth/google/callback"
    }, 
    async(accessToken, refreshToken, profile, done)=>{
        try{
            const foundUser = await User.findOne({googleId : profile.id}).exec();
            if(foundUser) {
                const roles = Object.values(foundUser.roles);
                const access_Token = jwt.sign(
                    {"Info" : {
                        "email" : foundUser.email, 
                        "roles" : roles,
                        "username" : foundUser.username
                    }}, 
                    process.env.ACCESS_TOKEN_SECRET, 
                    {expiresIn : '30s'}
                );
                const refresh_Token = jwt.sign(
                    {
                        "email" :foundUser.email
                    }, 
                    process.env.REFRESH_TOKEN_SECRET, 
                    {expiresIn : "1d"}
                );
                foundUser.refreshToken = refresh_Token;
                foundUser.lastLocation = req.body.location;
                await foundUser.save();
                // req.session.userId = foundUser._id;
                recordLogIns("New log in from ", req, foundUser); //no need for sync work
                res.cookie('jwt', refreshToken, {httpOnly : true, sameSite : "None", maxAge : 1000*60*60*24});
                // res.cookie('jwt', refreshToken, {httpOnly : true, secure :true, sameSite : "None", maxAge : 1000*60*60*24});
                res.json({access_Token});
                return done(null, foundUser);
            }
            else {
                const result = await User.create({
                    googleId : profile.id, 
                    email : profile.emails[0].value, 
                    username : profile.emails[0].value, //temporary 
                    password : '' //temporary
                });
                console.log(result);
                return done(null, result);
            }
        }
        catch(err){
            console.error(err); 
            return done(err, null);
        }
    }
    ));
}; 
module.exports = handleGoogleAuth;