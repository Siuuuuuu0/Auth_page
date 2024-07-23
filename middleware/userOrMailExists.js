const User = require('../model/User'); 
const alreadyExists = async(req, res, next)=>{
    if(req.body.toUpdate) 
    {
        const {username, email} = req.body.toUpdate; 
        if(!username&&!email) return next();
        if(username!==req.body.username&&await User.findOne({username}).exec()) return res.status(403).json({'message' : 'username already in use'});  
        if(email!==req.body.email&&await User.findOne({email}).exec()) return res.status(403).json({'message' : 'email already in use'});  
        return next();
    }
    if(!req?.body?.username&&!req.body.email) return res.status(400).json({'message' : 'email or username required'});
    const {username, email} = req.body;
    if(username
        &&await User.findOne({username}).exec()) return res.status(403).json({'message' : 'this username already exists'}) ;
    if(email
        &&await User.findOne({email}).exec()) return res.status(403).json({'message' : 'email already exists'});
    next();
}
module.exports = alreadyExists;