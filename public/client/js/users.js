/*SOCKET*/

// 1 : chức năng gửi lời mời kết bạn
const listButonAddFriend = document.querySelectorAll(".box-user [btn-add-friend]");
if(listButonAddFriend.length > 0) {
    listButonAddFriend.forEach(button => {
        button.addEventListener("click" , () => {
            // thêm class add vào box-user để nó hiển thị nội dung khác
            button.closest(".box-user").classList.add("add") ;

            const friendId = button.getAttribute("btn-add-friend")
            socket.emit("CLIENT_SEND_REQUEST_ADD_FRIEND" , friendId)
        })
    })
}
socket.on("SERVER_RETURN_REQUEST_ADD_FRIEND" , (data) => {
    // bắt lấy thông tin user gửi lời mời và in thông tin người đó ra giao diện đồng thời cũng phải cập nhật lại tất cả các nút hành động bởi vì khi bắt sự kiện mới
    const listAccept = document.querySelector(`[list-accept-my-id = "${data.friendId}"]`);
    const newBoxUser = document.createElement("div") ;
    newBoxUser.classList.add(`col-6`) ;
    newBoxUser.setAttribute(`friendId`,data.infoUser._id)
    newBoxUser.innerHTML = `
                <div class="box-user">
                    <div class="inner-avatar">
                        <img src=${data.infoUser.avatar} alt="Yalidas">
                    </div>
                    <div class="inner-info">
                        <div class="inner-name">${data.infoUser.username}</div>
                        <div class="inner-buttons">
                            <button class="btn btn-sm btn-primary mr-1" btn-accept-friend=${data.infoUser._id}>Chấp nhận</button>
                            <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend=${data.infoUser._id}>Từ chối</button>
                            <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend=${data.infoUser._id} disabled>Đã xóa</button>
                            <button class="btn btn-sm btn-primary mr-1" btn-accepted-friend=${data.infoUser._id} disabled>Đã chấp nhận</button>
                        </div>
                    </div>
                </div>
    `
    // xóa user gửi lời mời ra khỏi list danh sách đề cử của user được gửi và ngược lại
    const listRecomendation = document.querySelector(`[list-recomendation-my-id="${data.friendId}"]`);
    const BoxUserListRecomendation = listRecomendation.querySelector(`[friendId="${data.infoUser._id}"]`)
    listRecomendation.removeChild(BoxUserListRecomendation);


    listAccept.appendChild(newBoxUser);
    
    
    
    // listRecomendation.remove(BoxUserListRecomendation)


    // phải bắt sự kiện lại cho nút chấp nhận và từ chối , nhưng phải đứng từ thẻ mới thêm vào 
        const listButonRefuseFriend = newBoxUser.querySelectorAll(".box-user [btn-refuse-friend]");
        if(listButonRefuseFriend.length > 0) {
            listButonRefuseFriend.forEach(button => {
                button.addEventListener("click" , () => {
                    // thêm class add vào box-user để nó hiển thị nội dung khác
                    button.closest(".box-user").classList.add("refuse") ;

                    const friendId = button.getAttribute("btn-refuse-friend")
                    socket.emit("CLIENT_SEND_REQUEST_REFUSE_FRIEND" , friendId)
                })
            })
        }
        const listButonAcceptFriend = newBoxUser.querySelectorAll(".box-user [btn-accept-friend]");
        if(listButonAcceptFriend.length > 0) {
            listButonAcceptFriend.forEach(button => {
                button.addEventListener("click" , () => {
                    // thêm class add vào box-user để nó hiển thị nội dung khác
                    button.closest(".box-user").classList.add("accept") ;

                    const friendId = button.getAttribute("btn-accept-friend")
                    socket.emit("CLIENT_SEND_REQUEST_ACCEPT_FRIEND" , friendId)
                })
            })
        }
})
socket.on("SERVER_RETURN_QUANTITY_REQUEST_ADD_FRIEND" , (data) => {
    // sau khi client gửi lời mời kết bạn thì sever sẽ gửi về độ số lời mời kết bạn được gửi đến => bắt lấy sự kiện cập nhật ra giao diện
    const bageUserAccept = document.querySelector(`[badge-users-accept="${data.userId}"]`);
    if (bageUserAccept) {
        bageUserAccept.innerHTML = data.length
    }
    
})
// end chức năng gửi lời kết bạn


//2 : Chức năng hủy lời mời kết bạn
const listButonCancelFriend = document.querySelectorAll(".box-user [btn-cancel-friend]");
if(listButonCancelFriend.length > 0) {
    listButonCancelFriend.forEach(button => {
        button.addEventListener("click" , () => {
            // thêm class add vào box-user để nó hiển thị nội dung khác
            button.closest(".box-user").classList.remove("add") ;

            const friendId = button.getAttribute("btn-cancel-friend")
            socket.emit("CLIENT_SEND_REQUEST_CANCEL_FRIEND" , friendId)
        })
    })
}

socket.on("SERVER_RETURN_QUANTITY_REQUEST_CANCEL_FRIEND" , (data) => {
    // tương tự như bên gửi kết bạn thì khi ấn hủy lời mời thì ta cx cần cập nhật lại số lượng
    const bageUserAccept = document.querySelector(`[badge-users-accept="${data.userId}"]`);
    if (bageUserAccept) {
        bageUserAccept.innerHTML = data.length
    }
    
})
socket.on("SERVER_RETURN_ID_REQUEST_CANCEL_FRIEND" , (data) => {
    const listAccept = document.querySelector(`[list-accept-my-id = "${data.friendId}"]`);
    const BoxUserNeedDeleted = listAccept.querySelector(`[friendId="${data.myId}"]`);
    if(BoxUserNeedDeleted){
        listAccept.removeChild(BoxUserNeedDeleted)
    }
    
})
// end chức năng hủy lời mời kết bạn



//3 : Chức năng từ chối kết bạn
const listButonRefuseFriend = document.querySelectorAll(".box-user [btn-refuse-friend]");
if(listButonRefuseFriend.length > 0) {
    listButonRefuseFriend.forEach(button => {
        button.addEventListener("click" , () => {
            // thêm class add vào box-user để nó hiển thị nội dung khác
            button.closest(".box-user").classList.add("refuse") ;

            const friendId = button.getAttribute("btn-refuse-friend")
            socket.emit("CLIENT_SEND_REQUEST_REFUSE_FRIEND" , friendId)
        })
    })
}


// 4 : Chức năng chấp nhận kết bạn
const listButonAcceptFriend = document.querySelectorAll(".box-user [btn-accept-friend]");
if(listButonAcceptFriend.length > 0) {
    listButonAcceptFriend.forEach(button => {
        button.addEventListener("click" , () => {
            // thêm class add vào box-user để nó hiển thị nội dung khác
            button.closest(".box-user").classList.add("accept") ;

            const friendId = button.getAttribute("btn-accept-friend")
            socket.emit("CLIENT_SEND_REQUEST_ACCEPT_FRIEND" , friendId)
        })
    })
}

// 5 : Chức năng xóa bạn bè
const listButonRemoveFriend = document.querySelectorAll(".box-user [btn-remove-friend]");
if(listButonRemoveFriend.length > 0) {
    listButonRemoveFriend.forEach(button => {
        button.addEventListener("click" , () => {
            const friendId = button.getAttribute("btn-remove-friend")
            socket.emit("CLIENT_SEND_REQUEST_REMOVE_FRIEND" , friendId)
        })
    })
}


//6 : Chức năng hiển thị realtime trạng thái online hoặc offline
socket.on("SERVER_RETURN_USER_ONLINE" , (data) => {
    const divBoxUserFriend = document.querySelector("[list-friend-my-id]");
    const divUser = divBoxUserFriend.querySelector(`[friendId = "${data.myId}"]`);

    const divStatusOnline = divUser.querySelector("[statusOnline]");
    divStatusOnline.setAttribute("statusOnline" , data.statusOnline) ;
    
})
/*END SOCKET */