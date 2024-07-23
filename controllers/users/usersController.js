const User = require('../../model/User');
const bcrypt = require('bcrypt'); 
const deleteUser= async(req, res)=>{
    if(!req?.body?.id) return res.status(400).json({'message' : 'id required'});
    const foundUser = await User.findOne({_id : req.body.id}).exec(); 
    if(!foundUser) return res.status(204).json({'message' : 'no such user'});
    const result = await User.deleteOne({_id : req.body.id});
    res.status(200).json(result);
}; 
const updateUser = async(req, res)=>{
    if(!req?.body?.toUpdate?.username&&!req.body.toUpdate.email&&!req.body.toUpdate.password||!req.body.id) return res.sendStatus(400);
    const foundUser = await User.findOne({_id : req.body.id}).exec();
    const {email, password, username} = req.body.toUpdate;
    if(email) {
        // if(await User.findOne({email}).exec()) return res.status(403).json({'message' : 'email alreday in use'}); 
        foundUser.email= email; //2FA
    }
    if(password) foundUser.password = await bcrypt.hash(password, 10); //2FA
    if(username) {
        // if(await User.findOne({username}).exec()) return res.status(403).json({'message' : 'username alreday in use'});
        foundUser.username = username; 
    }
    const result = await foundUser.save();
    res.status(200).json(result);
}; 
// update : {toUpdate : {
//     } , 
//     id : 
const getUsers =async(req, res)=>{
    const users = await await User.find().select('-password').lean();
    if(!users) return res.status(204).json({'message' : 'no users found'});
    res.status(200).json(users);
};
const createUser = async(req, res)=>{
    if(!req?.body?.email||!req.body.password) return res.status(400).json({'message' : 'password and email required'});
    // if(await User.findOne({email: req.body.email}).exec()) return res.status(403).json({'message' : 'this email already exists'});
    // if(req.body.username&&await User.findOne({username : req.body.username}).exec()) return res.status(403).json({'message' : 'this username already exists'});
    try{
        const newUser = await User.create({
            email : req.body.email, 
            password : await bcrypt.hash(req.body.password, 10),  
            username : req.body.username?req.body.username:req.body.email
        });
        res.status(201).json(newUser);}
    catch(err){
        console.error(err);
    }
};
const getUser = async(req, res)=>{
    if(!req?.params?.id) return res.status(400).json({'message' : 'id required'});
    const foundUser = await User.findOne({_id : req.params.id}).select('-password').lean();
    if(!foundUser) return res.status(204).json({'message' : 'no such user'});
    res.status(200).json(foundUser);
};
module.exports = {deleteUser, updateUser, getUsers, createUser, getUser};
