const User = require("../../models/user.model");

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
                                roomChat :""
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
                                roomChat :""
                            }
                        },
                        $pull : {
                            acceptFriends : friendId
                        }
                    })
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