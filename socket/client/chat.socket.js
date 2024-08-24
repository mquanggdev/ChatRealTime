const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const streamUpload = require("../../helper/streamUpload.helper");
module.exports.chatSocket = (req,res) => {
    const userId = res.locals.user.id ;
    const username = res.locals.user.username ;
    const roomChat = req.params.roomChat;
    _io.once("connection" , (socket) => {
        socket.join(roomChat)
        socket.on("CLIENT_SEND_MESSAGE" , async (data) => {
            const chatData = {
                userId : userId,
                content : data.content,
                roomChat : roomChat
            }

            const linkImages = [] ;
            for (const image of data.images) {
                const linkImage = await streamUpload(image);
                 linkImages.push(linkImage.url);
            }
            
            chatData.images = linkImages;
            const newChat = new Chat(chatData) ;
            await newChat.save() ;
            
            _io.to(roomChat).emit("SERVER_RETURN_MESSAGE_TO_CLIENT" , {
                userId: userId,
                username : username ,
                content: data.content,
                images : linkImages
            })
        })

        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.to(roomChat).emit("SERVER_RETURN_TYPING", {
              userId: userId,
              username: username,
              type: type
            });
          })
    })
}