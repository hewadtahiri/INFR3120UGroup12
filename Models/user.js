let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');
let passportGoogle = require('passport-google-oauth');

let User = mongoose.Schema({
    username:
    {
        type:String,
        default:"",
        trim:true,
        required:"Email or Username is required"
    },
    displayName:
    {
        type:String,
        default:"",
        trim:true,
        required:"displayName is required"
    },
    
},{
    collection: "users"
});

// Configuration of Authentication options
let options = ({IncorrectPasswordError:"Wrong or Missing Username/Password."});
User.plugin(passportLocalMongoose,options);
module.exports.User = mongoose.model('User',User);