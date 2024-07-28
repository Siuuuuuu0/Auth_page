const axios = require('axios'); 
const User = require('../model/User'); 
const {suspiciousEmail} = require('../utilities/2FA');
const verifyForLocation = async(req, res, next)=>{
    if(!req.body.userOrMail) return res.status(400).json({'message' : 'no credential provided'}); 
    const userOrMail = req.body.userOrMail
    const regex = /^[A-Za-z0-9!#$%^&*_\-.]{3,20}$/;
    const isUsername = regex.test(userOrMail);
    const foundUser = await User.findOne(isUsername?{username : userOrMail}:{email : userOrMail}).exec(); 
    if(!foundUser) return next();
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geoResponse = await axios.get(`https://ipinfo.io/${ip}/json`);
    const geoData = geoResponse.data;
    const currentLocation = `${geoData.city}, ${geoData.region}, ${geoData.country}`;
    // console.log(currentLocation);
    if(currentLocation!==foundUser.lastLocation) 
        suspiciousEmail(foundUser.email, currentLocation);
    if(req.body.user) {
        foundUser.lastLocation = currentLocation;
        await foundUser.save(); 
    } 
    req.body.location = currentLocation;
    next();

}
module.exports = verifyForLocation; 