const axios = require('axios'); 
const User = require('../model/User'); 
const {suspiciousEmail} = require('../utilities/2FA');
const verifyForLocation = async(req, res, next)=>{
    if(!req?.body?.id) return res.status(400).json({'message' : 'no Id provided'}); 
    const foundUser = await User.findOne({_id : req.body.id}).exec(); 
    if(!foundUser) return next();
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geoResponse = await axios.get(`https://ipinfo.io/${ip}/json`);
    const geoData = geoResponse.data;
    const currentLocation = `${geoData.city}, ${geoData.region}, ${geoData.country}`;
    console.log(currentLocation);
    if(currentLocation!==foundUser.lastLocation) 
        suspiciousEmail(foundUser.email, currentLocation);
    req.body.location = currentLocation;
    next();

}
module.exports = verifyForLocation; 