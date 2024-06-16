const {format} = require('date-fns'); 
const {v4 : uuid} = require('uuid');
const fs = require('fs'); 
const fsPromises = fs.promises; 
const path = require('path'); 
const logEvents = async(message, fileName)=>{
    const dateTime =`${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${message}\t${uuid()}\t${dateTime}`; 
    try{
        if(!fs.existsSync (path.join(__dirname, '..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs')); 
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', fileName), logItem); 
    }catch(err){
        console.error(err); 
    }
}; 
const logger = (req, res, next)=>{
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}\t`, 'reqLog.txt'); 
    next();
};
module.exports = {logEvents, logger};