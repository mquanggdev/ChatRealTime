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
},{
    timestamps:true
})

const User = mongoose.model("User", userSchema, "users");
module.exports = User;