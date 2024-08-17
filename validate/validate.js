const User = require("../models/user.model");
const md5 = require("md5");
module.exports.validateFormRegister = (req,res,next) => {
    if (!req.body.username){
        console.log("Vui lòng nhập họ và tên");
        return;
    }
    if(!req.body.email){
        console.log("Vui lòng nhập emaill");
        return;
    }
    if(!req.body.password){
        console.log("Vui lòng nhập mật khẩu");
        return;
    }
    const existEmail = User.findOne({
        email:req.body.email
        }
    )
    if (existEmail){
        console.log("Email đã tồn tại!");
        return;
    }
    next() ;
}


module.exports.validateFormLogin = (req,res,next) => {
    
    if(!req.body.email){
        console.log("Vui lòng nhập emaill");
        return;
    }
    if(!req.body.password){
        console.log("Vui lòng nhập mật khẩu");
        return;
    }
    const existEmail = User.findOne({
        email:req.body.email
        }
    )
    if (!existEmail){
        console.log("Email không tồn tại");
        return;
    } else if (md5(req.body.password) !== existEmail.password){
        console.log("Mật khẩu không trùng khớp!");
        return;
    }
    
    next() ;
}