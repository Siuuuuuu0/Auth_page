const jwt = require('jsonwebtoken'); 
const verifyJWT = (req, res, next) => { 
    const authHeader = req.headers.authorization||req.headers.Authorization;
    if(!authHeader?.startsWith("Bearer ")) return res.status(401);
    const accessToken = authHeader.split(" ")[1]; 
    jwt.verify(
        accessToken, 
        process.env.ACCESS_TOKEN_SECRET, 
        (err, decoded)=>{
            if(err) return res.status(403).json({'message' : 'jwt failed'}); 
            req.email = decoded.Info.email; 
            req.roles = decoded.Info.roles;
            req.username = decoded.Info.username; 
            next(); 
        }
    );
}
module.exports = verifyJWT;