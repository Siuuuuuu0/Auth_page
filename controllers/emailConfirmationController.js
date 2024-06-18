const bcrypt = require('bcrypt');
const recordLogIns = require('../utilities/recordLogIns');
const User = require('../model/User');
const handleConfirmation = async(req, res)=>{
    const {password, email, username } = req.body; 
    if(!password||!email) return res.status(400).json({'message' : 'password and email required'});
    if(username) {
        const duplicateUsername = await User.findOne({username}).exec();
        if(duplicateUsername) return res.status(409).json({'message' : 'this username already exists'});
        const regex = /[a-zA-Z0-9]+$/;
        if(!regex.test(username)) return res.status(409).json({'message' : 'The Username cant contain special chars'}); 
    }
    try{
        const hashedPwd = await bcrypt.hash(password, 10);
        const result = await User.create({
            password :hashedPwd, 
            email :email, 
            username : username?username:email //if username exists then username, else the email
        });
        console.log(result);
        await recordLogIns("First log in from ", req, result);
        return res.status(201).json({'message' : `User ${result} has been created`});
    }
    catch(err){
        return res.status(500).json({'message' : err.message}); 
    }
}
module.exports = handleConfirmation; 