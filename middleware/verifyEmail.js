const jwt = require('jsonwebtoken');
const verifyEmail = async(req, res, next)=>{
    if(req.user.toRegister&&req.body.googleId) return next();
    if(!req?.query?.token) return res.status(400).json({'message' : 'no token provided'});
    token = req.query.token;
    jwt.verify(token, process.env.EMAIL_TOKEN_SECRET, (err, decoded)=>{
        if(err) return res.status(401).json({'message' : 'verification failed'});
        req.body.email = decoded.email;
        next();
    });
};
module.exports = verifyEmail;