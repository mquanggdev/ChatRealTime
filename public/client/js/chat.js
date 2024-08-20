var socket = io() ;

// CLIENT_SEND_MESSAGE
const formChat = document.querySelector(".chat .inner-form");
if(formChat){
    formChat.addEventListener("submit" ,(e) => {
        e.preventDefault();

        const content = e.target.content.value ;
        socket.emit("CLIENT_SEND_MESSAGE" , {
            content : content
        });
        e.target.content.value = ""
        
    }) 
}
// END_CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE_TO_CLIENT
socket.on("SERVER_RETURN_MESSAGE_TO_CLIENT" , (data) => {
    const chatContainer = document.querySelector(".chat");
    const curentuser = chatContainer.getAttribute("currentuser");
    const divChat = document.createElement("div");
    let userFullNameHtml = "" ;
    if(curentuser == data.userId){
        divChat.classList.add("inner-outgoing");
    }
    else{
        divChat.classList.add("inner-incoming");
        userFullNameHtml = `<div class="inner-name">${data.username}</div>`;
    }

    divChat.innerHTML = `
    ${userFullNameHtml}
    <div class="inner-content">${data.content}</div>
    `

    const bodyContainChat = document.querySelector(".chat .inner-body");
    bodyContainChat.appendChild(divChat) ;

    bodyContainChat.scrollTop = bodyContainChat.scrollHeight;
} )
// end SERVER_RETURN_MESSAGE_TO_CLIENT

// Scroll Chat To Bottom
const bodyContainChat = document.querySelector(".chat .inner-body");
if(bodyContainChat) {
    bodyContainChat.scrollTop = bodyContainChat.scrollHeight;
}
// End Scroll Chat To Bottom