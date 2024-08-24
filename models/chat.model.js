const mongoose = require("mongoose");


const chatSchema = new mongoose.Schema({
   userId : String,
   content : String ,
   images : Array ,
   roomChat : String
},{
    timestamps:true
})

const Chat = mongoose.model("Chat", chatSchema, "chats");
module.exports = Chat;