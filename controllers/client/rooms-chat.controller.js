const RoomChat = require("../../models/rooms-chat.model");
const User = require("../../models/user.model");
module.exports.index = async (req , res) => {
    const userId = res.locals.user.id;

    const listRoomChat = await RoomChat.find({
        typeRoom :"group",
        "members.userId": userId
    });
    res.render("client/page/rooms-chat/index.pug", {
        pageTitle : "Danh sách phòng",
        listRoomChat : listRoomChat
    })
}

module.exports.create = async (req, res) => {
    const friendsList = res.locals.user.friendsList;
  
    for(friend of friendsList) {
      const infoFriend = await User.findOne({
        _id: friend.userId
      }).select("username");
  
      friend.username = infoFriend.username;
    }
  
    res.render("client/page/rooms-chat/create", {
      pageTitle: "Tạo phòng",
      friendsList: friendsList
    });
  };

  // [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
    const title = req.body.title;
    let usersId = req.body.usersId;
    if (!Array.isArray(usersId)) {
      usersId = [usersId]; // Chuyển giá trị đơn thành mảng
    }
    const dataRoomChat = {
      title: title,
      typeRoom: "group",
      members: []
    };
  
    dataRoomChat.members.push({
      userId: res.locals.user.id,
      role: "superAdmin"
    });
  
    usersId.forEach(userId => {
      dataRoomChat.members.push({
        userId: userId,
        role: "member"
      });
    })
  
    const roomChat = new RoomChat(dataRoomChat);
    await roomChat.save();
  
    res.redirect(`/chat/${roomChat.id}`);
  };