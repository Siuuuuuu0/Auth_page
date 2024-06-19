const mongoose  = require('mongoose'); 
const Schema = mongoose.Schema; 
const userSchema = new Schema({
    password : {
        type : String,  
        required : true
    }, 
    newPassword : String, 
    username : {
        type : String, 
        unique : true, 
        required : true
    }, 
    email : {
        type : String, 
        unique :true,
        required : true
    }, 
    newEmail : String, 
    roles : {
        User : {
            type : Number, 
            default : 1
        }, 
        Editor : Number, 
        Admin : Number
    },
    logIns : {
        type : Array,
        default :[]
    },
    refreshToken : String, 
    twoFactorCode : String, 
    failedAttempts : {
        type : Number, 
        default :0 
    },
    indefiniteLock : Boolean, 
    lockedUntil : {
        type : Date, 
        default : undefined
    }, 
    lastLocation : String, 
    googleId : String
}); 
module.exports = mongoose.model("User", userSchema); 