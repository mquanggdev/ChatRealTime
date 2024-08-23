var socket = io() ;

const settingButton = document.querySelector(".box-profile .setting-profile");
const boxEditProfile = document.querySelector(".box-edit-profile");
const boxProfile = document.querySelector(".box-profile");
if(settingButton){
    settingButton.addEventListener("click" , () => {
        boxEditProfile.classList.toggle("show");
    })
}


const listButtonStatus = document.querySelector(".list-input-status") ;
if(listButtonStatus){
    const listInputStatus = listButtonStatus.querySelectorAll(".status");
    const statusCurrent = boxProfile.querySelector(".user-info p");
    
    listInputStatus.forEach(input => {
        if( input.value == statusCurrent.textContent){
            input.checked = true ;
        }
    })
    
}

// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", () => {
    const file = uploadImageInput.files[0];
    if(file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}

// End Upload Image
