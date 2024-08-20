const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
module.exports.chatSocket = (req,res) => {
    const userId = res.locals.user.id ;
    const username = res.locals.user.username ;
    _io.once("connection" , (socket) => {
        socket.on("CLIENT_SEND_MESSAGE" , async (data) => {
            const chatData = {
                userId : userId,
                content : data.content
            }
            const newChat = new Chat(chatData) ;
            await newChat.save() ;

            
            _io.emit("SERVER_RETURN_MESSAGE_TO_CLIENT" , {
                userId: userId,
                username : username ,
                content: data.content
            })
        })
        
    })
}