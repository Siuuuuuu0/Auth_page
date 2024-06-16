const whitelist = require('./whitelist'); 
const credentials = (req, res, next)=>{
    const origin = req.headers.origin||req.headers.Origin; 
    if(whitelist.includes(origin)) res.header('Access-Control-Allow-Credentials', true); 
    next(); 
}
module.exports = credentials; 