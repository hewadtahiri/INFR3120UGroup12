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
    password:
    {
        type:String,
        default:"",
        trim:true,
        required:'Password is required'
    },
    displayName:
    {
        type:String,
        default:"",
        trim:true,
        required:"displayName is required"
    },
    email:
    {
        type:String,
        default:"",
        trim:true,
        required:'Email is required'
    },
    created:
    {
        type:Date,
        default:Date.now
    },
    update:
    {
        type:Date,
        default:Date.now
    }
    
},{
    collection: "users"
});

// Configuration of authentication options.
let options = ({IncorrectPasswordError:"Wrong or Missing Username/Password."});
User.plugin(passportLocalMongoose,options);
module.exports.User = mongoose.model('User',User);