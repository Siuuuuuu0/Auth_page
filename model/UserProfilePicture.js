const mongoose  = require('mongoose'); 
const Schema = mongoose.Schema; 
const userProfilePictureSchema = new Schema({
    userId : {
        type : String, 
        required : true, 
        unique : true
    }, 
    Key : {
        type : String, 
        required : true, 
        unique : true
    }
}); 
module.exports = mongoose.model("UserProfilePicture", userProfilePictureSchema); 