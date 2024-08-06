const axios = require('axios');
const User = require('../model/User');
const { suspiciousEmail } = require('../utilities/2FA');

const verifyForLocation = async (req, res, next) => {
    try {
        const userOrMail = req.body.userOrMail;
        if (!userOrMail) return res.status(400).json({ 'message': 'No credential provided' });

        const regex = /^[A-Za-z0-9!#$%^&*_\-.]{3,20}$/;
        const isUsername = regex.test(userOrMail);
        const foundUser = await User.findOne(isUsername ? { username: userOrMail } : { email: userOrMail }).exec();

        if (!foundUser) return next(); 

        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const geoResponse = await axios.get(`https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_API_KEY}`);
        const geoData = geoResponse.data;
        const currentLocation = `${geoData.city}, ${geoData.region}, ${geoData.country}`;

        if (currentLocation !== foundUser.lastLocation) {
            await suspiciousEmail(foundUser.email, currentLocation);
        }

        if (req.body.user) {
            foundUser.lastLocation = currentLocation;
            await foundUser.save();
        }

        req.body.location = currentLocation;
        next();
    } catch (error) {
        console.error('Error verifying location:', error);
        res.status(500).json({ 'message': 'Internal Server Error' });
    }
};

module.exports = verifyForLocation;
