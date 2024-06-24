const User = require('../model/User');
const getId = async(req, res, next)=>{
    if(req.body.id) return next();
    if(!req?.body?.username&&!req.body.email) return res.status(400).json({'message' : 'username or email required'});
    const foundUser = req.body.email 
        ? await User.findOne({email : req.body.email}).exec() 
        : await User.findOne({username : req.body.username}).exec();
    if(!foundUser) return res.status(404).json({'message' : 'no such user'});
    req.body.id = foundUser._id;
    next();
};
module.exports = getId;