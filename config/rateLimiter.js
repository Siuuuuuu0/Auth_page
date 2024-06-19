const limiter = require('express-rate-limit');
const ATTEMPT_LIMIT = 5; 
const LOCK_DURATION = 1000*60*15;
const User = require('../model/User');
const {failedLoginMail} = require('../utilities/2FA');
const loginLimiter = limiter({
    skipSuccessfulRequests : true, 
    windowMs : 1000 *60 *60 *24, //1 day
    max : 5, 
    message : "Too many log-in attempts, try again later"
});

const emailLimiter = limiter({
    skipSuccessfulRequests : true, 
    windowMs : 1000*60*60*30, //30 days
    max : 5, 
    message : "Too many requests, this IP has been blocked for 30 days", 
    handler :  async(req, res, next, options)=>{
        if(!req?.body?.id) return res.status(400);
        const foundUser = await User.findOne({_id : req.body.id}).exec();
        failedLoginMail(foundUser.email, req.headers['x-forwarded-for']?req.headers['x-forwarded-for']:req.ip);
        res.status(options.statusCode).send(options.message);
    }
});

module.exports = {loginLimiter, emailLimiter, ATTEMPT_LIMIT, LOCK_DURATION};