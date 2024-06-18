const {mailOptions, transporter} = require('../config/mailSettings');
const crypto = require('crypto');
const mailCode  = async(user) =>{
    const code = crypto.randomBytes(3).toString('hex');
    user.twoFactorCode = code; 
    await user.save();
    await transporter.sendMail(mailOptions(user.email, code), (err, info)=>{
        if(err) console.error(err); 
        else console.log(info);
    });
}
module.exports = mailCode;