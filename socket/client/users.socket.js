const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");

module.exports.usersSocket = (req,res) => {
    const myId = res.locals.user.id ;
    try {
        _io.once("connection" , (socket) => {
            // 1 : khi ấn vào nút kết bạn
            socket.on("CLIENT_SEND_REQUEST_ADD_FRIEND" , async (friendId) => {
                // với sự kiện này thì ta sẽ thêm id của người bạn B vào list request của mình và thêm id của mình vào list accept của người bạn đó
                const existFriendInListRequest = await User.findOne({
                    _id : myId,
                    requestFriends : friendId
                })

                if(!existFriendInListRequest){
                    await User.updateOne({
                        _id :myId
                    } , {
                        $push : {
                            requestFriends: friendId
                        }
                    })
                }

                const existFriendInListAccept = await User.findOne({
                    _id : friendId,
                    acceptFriends : myId
                })

                if(!existFriendInListAccept){
                    await User.updateOne({
                        _id: friendId
                    } , {
                        $push : {
                            acceptFriends : myId
                        }
                    })
                }
                // Khi mình gửi lời mời kết bạn thì ta phải hiển thị thông tin bản thân vào trong danh sách đã nhận của người bạn kia
                const myInfo = await User.findOne({
                    _id : myId
                })
                socket.broadcast.emit("SERVER_RETURN_REQUEST_ADD_FRIEND" , {
                    infoUser : myInfo ,
                    friendId : friendId
                });

                // ví dụ khi mình ấn nút gửi kết bạn thì sẽ cần phải cập nhật lại số lượng lời mời đã nhận bên người bạn kia => sự kiện này sẽ được gửi đến bên kia
                const infoYorFriend = await User.findOne({
                    _id : friendId 
                }) 
                socket.broadcast.emit("SERVER_RETURN_QUANTITY_REQUEST_ADD_FRIEND" , {
                    length : infoYorFriend.acceptFriends.length,
                    userId : friendId
                })
            })
            

            // 2 : khi ấn vào nút hủy kết bạn
            socket.on("CLIENT_SEND_REQUEST_CANCEL_FRIEND" , async (friendId) => {
                // với sự kiện này thì ta sẽ XÓA id của người bạn B trong list request của mình và xóa id của mình vào list accept của người bạn đó
                const existFriendInList = await User.findOne({
                    _id : myId,
                    requestFriends : friendId
                })

                if(existFriendInList){
                    await User.updateOne({
                        _id :myId
                    } , {
                        $pull : {
                            requestFriends: friendId
                        }
                    })
                }

                const existFriendInListAccept = await User.findOne({
                    _id : friendId,
                    acceptFriends : myId
                })

                if(existFriendInListAccept){
                    await User.updateOne({
                        _id: friendId
                    } , {
                        $pull : {
                            acceptFriends : myId
                        }
                    })
                }

                const infoYorFriend = await User.findOne({
                    _id : friendId 
                }) 
                socket.broadcast.emit("SERVER_RETURN_QUANTITY_REQUEST_CANCEL_FRIEND" , {
                    length : infoYorFriend.acceptFriends.length,
                    userId : friendId
                })

                socket.broadcast.emit("SERVER_RETURN_ID_REQUEST_CANCEL_FRIEND" , {
                    myId : myId,
                    friendId : friendId
                })
            })

            // 3 : khi ấn vào nút từ chối kết bạn
            socket.on("CLIENT_SEND_REQUEST_REFUSE_FRIEND" , async (friendId) => {
                // với sự kiện này thì ta sẽ XÓA id của người bạn B trong list accept của mình và xóa id của mình vào list request của người bạn đó
                const existFriendInList = await User.findOne({
                    _id : friendId,
                    requestFriends : myId
                })

                if(existFriendInList){
                    await User.updateOne({
                        _id :friendId
                    } , {
                        $pull : {
                            requestFriends: myId
                        }
                    })
                }

                const existFriendInListAccept = await User.findOne({
                    _id : myId,
                    acceptFriends : friendId
                })

                if(existFriendInListAccept){
                    await User.updateOne({
                        _id: myId
                    } , {
                        $pull : {
                            acceptFriends : friendId
                        }
                    })
                }
            })

            // 4 : khi ấn vào nút chấp nhận kết bạn
            socket.on("CLIENT_SEND_REQUEST_ACCEPT_FRIEND" , async (friendId) => {
                // với sự kiện này thì ta sẽ thêm id của người bạn B vào list friend  của mình và xóa id của người bạn B trong list accept của mình 
                // thêm id của mình vào list friend của người bạn B và xóa id của mình trong list request của người bạn đó
                // tạo phòng chat
                try{
                const friend = await User.findOne({
                    _id:friendId
                })
                const roomChat = new RoomChat({
                    title: friend.username ,
                    typeRoom : "friend" ,
                    avatar : friend.avatar,
                    members : [
                        {
                            userId : myId,
                            role : "member",
                        },{
                            userId : friendId,
                            role :  "member"
                        }
                    ]
                })
                await roomChat.save() ;

                const existFriendInListRequest = await User.findOne({
                    _id : friendId,
                    requestFriends : myId
                })

                if(existFriendInListRequest){
                    await User.updateOne({
                        _id :friendId
                    } , {
                        $push :{
                            friendsList : {
                                userId : myId,
                                roomChat :roomChat.id
                            }
                        },
                        $pull : {
                            requestFriends: myId
                        }
                    })
                }

                const existFriendInListAccept = await User.findOne({
                    _id : myId,
                    acceptFriends : friendId
                })

                if(existFriendInListAccept){
                    await User.updateOne({
                        _id: myId
                    } , {
                        $push :{
                            friendsList : {
                                userId : friendId,
                                roomChat :roomChat.id
                            }
                        },
                        $pull : {
                            acceptFriends : friendId
                        }
                    })
                }
            }catch(e){
                    console.log(e); 
                }
            })

            // 5 : khi ấn vào nút xóa bạn bè
            socket.on("CLIENT_SEND_REQUEST_REMOVE_FRIEND" , async (friendId) => {
                // với sự kiện này thì ta sẽ xóa id của người bạn B vào list friend  của mình và xóa id của mình trong list friend của người bạn B 
                const existFriendInMyListFriend = await User.findOne({
                    _id : myId,
                    "friendsList.userId" : friendId
                })
                
                if(existFriendInMyListFriend){
                
                    const result = await User.updateOne({
                        _id :myId
                    } , {
                        $pull: {
                            friendsList: {
                                userId: friendId
                            }
                        }
                    })
                }

                const existFriendInYourListFriend = await User.findOne({
                    _id : friendId,
                    "friendsList.userId" : myId
                })

                if(existFriendInYourListFriend){
                    await User.updateOne({
                        _id: friendId
                    } , {
                        $pull: {
                            friendsList: {
                                userId: myId
                            }
                        }
                    })
                }



            })
        })        
    } catch (error) {
        console.log(error);
    }
}