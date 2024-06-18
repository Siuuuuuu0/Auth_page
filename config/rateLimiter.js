const limiter = require('express-rate-limit');

const loginLimiter = limiter({
    windowMs : 1000 *60 *60 *3, //3 hours
    max : 5, 
    message : "Too many log-in attempts, try again later"
});

const emailLimiter = limiter({
    windowMs : 1000*60*60*24, //1 day
    max : 5, 
    message : "Too many requests"
});

module.exports = {loginLimiter, emailLimiter};