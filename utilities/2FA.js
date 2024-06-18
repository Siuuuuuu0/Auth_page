const {mailOptionsCode, mailOptionsConfirm, transporter} = require('../config/mailSettings');
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); 
const mailCode  = async(user) =>{
    const code = crypto.randomBytes(3).toString('hex');
    user.twoFactorCode = code; 
    await user.save();
    transporter.sendMail(mailOptionsCode(user.email, code), (err, info)=>{
        if(err) console.error(err); 
        else console.log(info);
    });
}
const confirmMail = async(email)=>{
    const emailToken = jwt.sign(
        {"email" : email}, 
        process.env.EMAIL_TOKEN_SECRET, 
        {expiresIn : '10m'}
    );
    const url = `${process.env.BASE_URL}/register/confirm-email?token=${emailToken}`;
    transporter.sendMail(mailOptionsConfirm(email, url), (err, info)=>{
        if(err) console.log(err); 
        else console.log(info);
    });
}
module.exports = {mailCode, confirmMail};