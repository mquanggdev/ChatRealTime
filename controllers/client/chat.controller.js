const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const chatSocket = require("../../socket/client/chat.socket")
module.exports.index = async (req , res) => {
    chatSocket.chatSocket(req,res) ;

    const chats = await Chat.find({});
    for (const chat of chats) {
         const infoUser = await User.findOne({
            _id : chat.userId
         })
         if(infoUser){
            chat.fullname = infoUser.username ; 
         }
         
    }
    res.render("client/page/chat/index.pug" ,{
        pageTitle : "Chat",
        chats : chats
    }
    );
}