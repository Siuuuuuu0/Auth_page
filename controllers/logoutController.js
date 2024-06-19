const User = require('../model/User'); 
const handleLogout = async(req, res)=>{
    const cookies = req.cookies; 
    if(!cookies?.jwt) return res.sendStatus(401); 
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({refreshToken}).exec();
    if(!foundUser) {
        res.clearCookie('jwt', {httpOnly : true, sameSite : "None"}); 
        // res.clearCookie('jwt', {httpOnly :true, secure: true, sameSite :'None'}); 
        return res.sendStatus(403); 
    }
    else{
        req.session.destroy((err)=>{
            if(err) console.error(err); 
            else{
                res.clearCookie('connect.sid');
            }
        });
        res.clearCookie('jwt', {httpOnly : true, sameSite : "None"}); 
        // res.clearCookie('jwt', {httpOnly : true, secure :true, sameSite : "None"}); 
        foundUser.refreshToken = ''; 
        await foundUser.save(); 
        return res.sendStatus(204); 
    }

}; 
module.exports= handleLogout; 