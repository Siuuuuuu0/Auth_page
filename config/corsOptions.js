const whitelist = require('./whitelist'); 
const corsOptions = {
    origin : (origin, callback) =>{
        if(whitelist.includes(origin)||!origin) callback(null, true); 
        else callback(new Error("Blocked by CORS"));
    }, 
    optionsSuccessStatus : 200, 
    credentials: true,
};
module.exports = corsOptions; 