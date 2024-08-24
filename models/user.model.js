const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    username : String,
    email : String ,
    password : String ,
    tokenUser : String ,
    avatar : String ,
    status : {
        type : String ,
        default: "active"
    },
    address : String,
    phone : String,
    acceptFriends : Array,
    requestFriends : Array,
    friendsList : Array,
    statusOnline : String
},{
    timestamps:true
})

const User = mongoose.model("User", userSchema, "users");
module.exports = User;