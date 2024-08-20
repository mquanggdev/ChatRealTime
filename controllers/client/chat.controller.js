module.exports.index = (req , res) => {
    res.render("client/page/chat/index.pug" ,{
        pageTitle : "Chat"
    }
    );
}