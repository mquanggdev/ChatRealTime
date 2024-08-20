module.exports.index = (req , res) => {
    _io.once("connection" , (socket) => {
        console.log("Có 1 người kết nối" , socket.id);
    })
    res.render("client/page/chat/index.pug" ,{
        pageTitle : "Chat"
    }
    );
}