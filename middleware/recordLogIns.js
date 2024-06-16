const {format} = require('date-fns'); 
const recordLogIns = async(message, req, user) =>{ 
    const ip = req.headers['x-forwarded-for'];
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${message} from ${ip} at ${dateTime}`;
    user.logIns.push(logItem);
    await user.save();
};
module.exports = recordLogIns;