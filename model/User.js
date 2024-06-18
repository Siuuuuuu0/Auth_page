const mongoose  = require('mongoose'); 
const Schema = mongoose.Schema; 
const userSchema = new Schema({
    password : {
        type : String, 
        required : true
    }, 
    username : {
        type : String, 
        required : true
    }, 
    email : {
        type : String, 
        required : true
    }, 
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
    verified : {
        type : Boolean, 
        default : false
    }
}); 
module.exports = mongoose.model("User", userSchema); 