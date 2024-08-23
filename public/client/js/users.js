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
    // sau khi client gửi lời mời kết bạn thì sever sẽ gửi về độ số lời mời kết bạn được gửi đến => bắt lấy sự kiện cập nhật ra giao diện
    socket.on("SERVER_RETURN_QUANTITY_REQUEST_ADD_FRIEND" , (data) => {
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
// tương tự như bên gửi kết bạn thì khi ấn hủy lời mời thì ta cx cần cập nhật lại số lượng
socket.on("SERVER_RETURN_QUANTITY_REQUEST_CANCEL_FRIEND" , (data) => {
    const bageUserAccept = document.querySelector(`[badge-users-accept="${data.userId}"]`);
    if (bageUserAccept) {
        bageUserAccept.innerHTML = data.length
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
/*END SOCKET */