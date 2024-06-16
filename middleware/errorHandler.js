const logEvents = require('./logEvents').logEvents;
const handleErrors = (err, req, res, next)=>{
    logEvents(err.message, 'errLog.txt'); 
    console.error(err.stack); 
    res.status(500).send(err.message); 
}; 
module.exports = handleErrors; 