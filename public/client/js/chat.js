
import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'


//  Typing event
const inputChatBox = document.querySelector(".chat .inner-form input[name='content']");
var typingTimeOut ;
if(inputChatBox){
    
    inputChatBox.addEventListener("keyup" , () => {
        socket.emit("CLIENT_SEND_TYPING" , "show");
        clearTimeout(typingTimeOut);

    typingTimeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING" , "hidden");
        },3000);
    })  
}
// end typing


// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if(elementListTyping){
    
    socket.on("SERVER_RETURN_TYPING" , (data) => {
        if(data.type == "show"){
            const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if(!existTyping){
                const boxTyping = document.createElement("div") ;
                boxTyping.classList.add("box-typing") ;
                boxTyping.setAttribute("user-id" , data.userId)

                boxTyping.innerHTML = `
                <div class="inner-name">${data.username}</div>
                <div class="inner-dots"><span></span><span></span><span></span></div>
                `;
                elementListTyping.appendChild(boxTyping);
                const bodyContainChat = document.querySelector(".chat .inner-body");
                if(bodyContainChat) {
                    bodyContainChat.scrollTop = bodyContainChat.scrollHeight;
                }
            }
        }else{
            const boxTypingDelete = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if(boxTypingDelete) {
                elementListTyping.removeChild(boxTypingDelete);
              }
        }
    })
}
//SERVER_RETURN_TYPING


// CLIENT_SEND_MESSAGE
const formChat = document.querySelector(".chat .inner-form");
if(formChat){
    const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images' , {
        multiple : true ,
        maxFileCount : 6
    });

    
    upload.emulateInputSelection();
    formChat.addEventListener("submit" ,(e) => {
        e.preventDefault();

        const content = e.target.content.value ;

        const images = upload.cachedFileArray;
        if(content || images.length > 0){
            socket.emit("CLIENT_SEND_MESSAGE" , {
                content : content,
                images : images
            });
            e.target.content.value = "";
            upload.resetPreviewPanel();
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
        
        
    }) 
}
// END_CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE_TO_CLIENT
socket.on("SERVER_RETURN_MESSAGE_TO_CLIENT" , (data) => {
    const chatContainer = document.querySelector(".chat");
    const curentuser = chatContainer.getAttribute("currentuser");
    const divChat = document.createElement("div");
    let userFullNameHtml = "" ;
    let htmlContent = "" ;
    let htmlImages = "" ;
    if(curentuser == data.userId){
        divChat.classList.add("inner-outgoing");
    }
    else{
        divChat.classList.add("inner-incoming");
        userFullNameHtml = `<div class="inner-name">${data.username}</div>`;
    }

    if(data.content != ""){
        htmlContent = `<div class="inner-content">${data.content}</div>`;
    }
    if(data.images.length > 0) {
        htmlImages += `
          <div class="inner-images">
        `;
    
        for (const image of data.images) {
          htmlImages += `
            <img src="${image}">
          `;
        }
    
        htmlImages += `
          </div>
        `;
      }

    divChat.innerHTML = `
    ${userFullNameHtml}
    ${htmlContent}
    ${htmlImages}
    `

    const bodyContainChat = document.querySelector(".chat .inner-body");
    bodyContainChat.insertBefore(divChat, elementListTyping);

    bodyContainChat.scrollTop = bodyContainChat.scrollHeight;
    new Viewer(divChat);
} )
// end SERVER_RETURN_MESSAGE_TO_CLIENT

// Scroll Chat To Bottom
const bodyContainChat = document.querySelector(".chat .inner-body");
if(bodyContainChat) {
    bodyContainChat.scrollTop = bodyContainChat.scrollHeight;
}
// End Scroll Chat To Bottom


// Icon emoji
const emoji = document.querySelector('emoji-picker')
if(emoji) {
    const inputBox = document.querySelector(".chat .inner-form input[name='content']");
    emoji.addEventListener('emoji-click', event => {
        const icon = event.detail.unicode ;
        if(icon) {
            inputBox.value = inputBox.value + icon ;
        }
    });
}

// Giấu popup icon vào 1 icon nào đó
const buttonIcon = document.querySelector('[button-icon]');
if(buttonIcon){
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonIcon, tooltip);
    buttonIcon.addEventListener("click" , () => {
        tooltip.classList.toggle('shown');
        })       
}
// end Icon emoji

// Preview Image
if(bodyContainChat) {
    new Viewer(bodyContainChat);
  }
  // End Preview Image