const nodemailer = require ('nodemailer');
const mailOptionsCode = (email, code) => {
    return {
    from : {
        name : "Auth page",
        adress : process.env.EMAIL
    }, 
    to : email,
    subject : 'Your verification code', 
    text : `Your verification code is ${code}`
    };
};

const mailOptionsConfirm = (email, url)=>{
    return  {
        from : {
            name : "Auth page",
            adress : process.env.EMAIL
        }, 
        to : email,
        subject : 'Confirm your email', 
        text : url
    };
};

const transporter = nodemailer.createTransport({
    service : 'gmail', 
    host :'smtp.gmail.com',
    port : 465, 
    secure : true, 
    auth : {
        'user' : process.env.EMAIL, 
        'pass' : process.env.PASSWORD 
    }
});
module.exports = {mailOptionsCode, mailOptionsConfirm, transporter} ;