const jwt = require('jsonwebtoken'); 
const verifyJWT = (req, res, next) => { 
    const authHeader = req.headers.authorization||req.headers.Authorization;
    if(!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
    const accessToken = authHeader.split(" ")[1]; 
    jwt.verify(
        accessToken, 
        process.env.ACCESS_TOKEN_SECRET, 
        (err, decoded)=>{
            if(err) return res.sendStatus(403); 
            req.email = decoded.Info.email; 
            req.roles = decoded.Info.roles; 
            next(); 
        }
    );
}
module.exports = verifyJWT;