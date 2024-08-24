const mongoose = require("mongoose");


const roomSchema = new mongoose.Schema({
    title : String, 
    avatar : String ,
    typeRoom : String ,
    members : [
        {
            userId : String ,
            role : String ,
        }
    ],
    deleted : {
        type : Boolean ,
        default : false
    }
},{
    timestamps:true
})

const RoomChat = mongoose.model("RoomChat", roomSchema, "rooms-chat");
module.exports = RoomChat;