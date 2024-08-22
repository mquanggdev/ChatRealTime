const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgotPassword.model")
const generate = require("../../helper/generate.helper");
const sendEmailHelper = require("../../helper/sendEmail.helper");

var md5 = require('md5');

// Get users/register
module.exports.register = async (req , res) => {
    res.render("client/page/users/register.pug", {
        pageTitle : "Trang đăng ký"
    })
}

// post users/registerPost
module.exports.registerPost = async (req , res) => { 
    const record = {} ;
    record.username = req.body.username ;
    record.password = md5(req.body.password);
    record.email = req.body.email;
    const tokenUser = generate.generateToken(30);
    record.tokenUser = tokenUser ;
    record.avatar = "Link" ;
    
    const newAccountsUser = new User(record);
    await newAccountsUser.save() ;

    res.cookie("tokenUser" , newAccountsUser.tokenUser);
    
    res.redirect("/");
}


// Get users/login
module.exports.login = async (req , res) => {    
    res.render("client/page/users/login.pug" ,{
        pageTitle : "Trang đăng nhập"
    })
}

// post users/login
module.exports.loginPost = async (req , res) => {
    const email = req.body.email;
    const password = md5(req.body.password) ;
    
    const user = await User.findOne({
        email : email,
        status : "active"
    })
    if (!user) {
        return ;
    }
    if(user.password !== password){
        return;
    }

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/dashboard");

}

// [GET] /users/logout
module.exports.logout = async (req , res) => {
    res.clearCookie("tokenUser");
    res.redirect("/")
}


// Get users/forgot
module.exports.forgot = async (req , res) => {    
    res.render("client/page/users/forgot.pug" ,{
        pageTitle : "Trang nhập email xác thực"
    })
}

// post users/forgot
module.exports.forgotPost = async (req , res) => {
    const email = req.body.email ;
    const exsitUser = await User.findOne({
        email : email ,
        status:"active"
    });
    if(!exsitUser) {
        console.log("Không tồn tại email!");
        res.redirect("back");
        return ;
    }
    const otp = generate.generateOtp(6) ;

    const infoOtpObj = {
        email : email,
        otp : otp,
        expireAt : Date.now() + 1*60*1000  
    }
    const newInfoOtpObj = new ForgotPassword(infoOtpObj);
    await newInfoOtpObj.save() ;

    const subject = `Mã OTP lấy lại mật khẩu.`;
    const textHTML = `Mã OTP xác thực của bạn là <b style="color: green;">${otp}</b>. Mã OTP có hiệu lực trong 3 phút. Vui lòng không cung cấp mã OTP cho người khác.`;

    sendEmailHelper.sendMail(email,subject,textHTML);

    res.redirect(`/users/otp?email=${email}`);
}


// Get users/otp
module.exports.otpEnter = async (req , res) => {
    const email = req.query.email ;
    res.render("client/page/users/otpEnter.pug" ,{
        pageTitle : "Nhập OTP",
        email: email
    })
}
// post users/otp
module.exports.otpEnterPost = async (req , res) => {    
    const email = req.body.email;
    const otp = req.body.otp ;
    

    const record = await ForgotPassword.findOne({
        email : email,
        otp : otp
    })

    if(!record){
        console.log("Mã OTP không hợp lệ");
        return;
    }

    const user = await User.findOne({
        email:email
    })

    res.cookie("tokenUser" , user.tokenUser);
    res.redirect("/users/resetPassword");
}

// Get users/resetPassword
module.exports.reset = async (req , res) => {
    res.render("client/page/users/reset.pug" ,{
        pageTitle : "Nhập mât khẩu mới",
    })
}

// Post users/resetPassword
module.exports.resetPost = async (req , res) => {
    const password = req.body.password ;
    const re_password = req.body.re_password;

    if(password != re_password){
        console.log("Mật khẩu không trùng khớp");
        res.redirect("back");
    }

    const newPassword = md5(password) ;

    const user = await User.findOne({
        tokenUser : req.cookies.tokenUser
    });

    await User.updateOne({
        _id : user.id
    },{
        password : newPassword
    })


    res.redirect("/")
}
