const User = require('../../model/User');
const bcrypt = require('bcrypt'); 
const deleteUser= async(req, res)=>{
    if(!req?.body?.id) return res.status(400).json({'message' : 'id required'});
    const foundUser = await User.findOne({_id : req.body.id}).exec(); 
    if(!foundUser) return res.status(204).json({'message' : 'no such user'});
    await User.deleteOne({_id : req.body.id});
    res.status(200).json({message : 'Deleted successfully'});
}; 
const updateUser = async (req, res) => {
    if (!req?.body?.toUpdate?.username && !req.body.toUpdate.email && !req.body.toUpdate.password && !req.body.toUpdate.roles || !req.body.id) {
        return res.sendStatus(400);
    }
    try {
        const foundUser = await User.findOne({ _id: req.body.id }).exec();
        const { email, password, username, roles } = req.body.toUpdate;
        if (email) {
            foundUser.email = email; //2FA
        }
        if (password) {
            foundUser.password = await bcrypt.hash(password, 10); //2FA
        }
        if (username) {
            foundUser.username = username;
        }
        if (roles) {
            foundUser.roles = roles;
        }
        await foundUser.save();
        return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to update user' });
    }
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
        await User.create({
            email : req.body.email, 
            password : await bcrypt.hash(req.body.password, 10),  
            username : req.body.username?req.body.username:req.body.email
        });
        res.status(201);}
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
