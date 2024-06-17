const {format} = require('date-fns'); 
const macaddress = require('macaddress'); 
const recordLogIns = async(message, req, user) =>{ 
    const ip = req.headers['x-forwarded-for'];
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${message} Ip ${ip}, Mac ${macaddress.one((err, mac)=>{
        if(err) {
            console.error("Error while getting Mac", err); 
            return;}
        else return mac;
    })} at ${dateTime}`;
    user.logIns.push(logItem);
    await user.save();
};
module.exports = recordLogIns;