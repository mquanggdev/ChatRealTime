const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgotPassword.model")
const generate = require("../../helper/generate.helper");
const sendEmailHelper = require("../../helper/sendEmail.helper");
const usersSocket = require("../../socket/client/users.socket")
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
    await User.updateOne({
        email: email ,
    },{
        statusOnline : "online"
    })

    _io.once("connection", (socket) => {
        // Trả ra cho bạn bè trạng thái online của mình
        socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", {
          statusOnline: "online",
          myId: user.id
        })
      });

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/dashboard");

}

// [GET] /users/logout
module.exports.logout = async (req , res) => {
    try {
        await User.updateOne({
            _id: res.locals.user.id ,
        },{
            statusOnline : "offline"
        })
    } catch (error) {
        console.log(error);
        
    }
    
    _io.once("connection", (socket) => {
        // Trả ra cho bạn bè trạng thái online của mình
        socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", {
          statusOnline: "offline",
          myId: res.locals.user.id
        })
      });
    
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


// Get users/profile
module.exports.profile = async (req , res) => {
    const user = await User.findOne({
        tokenUser : req.cookies.tokenUser
    }
    );
    
    const profileUser = {
        username: user.username,
        email : user.email,
        phone : user.phone || "Chưa cập nhật" ,
        address : user.address || "Chưa cập nhật",
        avatar : user.avatar || "",
        statusOnline : user.statusOnline
    }
    res.render("client/page/profile/index.pug" ,{
        pageTitle : "Trang cá nhân",
        profileUser : profileUser
    })
}

// Post users/profile/edit
module.exports.profilePost = async (req , res) => {
    const newObject = {
        name: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        avatar: req.body.avatar,
        statusOnline: req.body.status
    }
    const tokenUser = req.cookies.tokenUser ;
    
    if(tokenUser){
        await User.updateOne({
            tokenUser : tokenUser 
        } , newObject );
    }
    _io.once("connection", (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", {
          statusOnline: req.body.status,
          myId: res.locals.user.id
        })
      });

    res.redirect("/users/profile");
}


// get users/friend-recomendation-list
module.exports.friendRecomendation = async (req , res) => {
    const userId = res.locals.user.id ;
    // SocketIO
    usersSocket.usersSocket(req, res);
    // End SocketIO

    const requestFriends = res.locals.user.requestFriends;
    const acceptFriends = res.locals.user.acceptFriends;
    const friendsList = res.locals.user.friendsList;
    const friendsListId = friendsList.map(item => item.userId);
    
    const listUser = await User.find({
        $and : [
            {_id : {$ne : userId}},
            {_id : {$nin : requestFriends}},
            {_id : {$nin : acceptFriends}},
            {_id : {$nin : friendsListId}},
        ],
        status :"active",
    }).select("id avatar username");

    res.render("client/page/users/friend-recomendation-list", {
        pageTitle: "Danh sách đề cử kết bạn",
        users: listUser
      });
}

// get users/list-friends
module.exports.friends = async (req , res) => {
    const userId = res.locals.user.id ;
    // SocketIO
    usersSocket.usersSocket(req, res);
    // End SocketIO

    const friendsList = res.locals.user.friendsList;
    const friendsListId = friendsList.map(item => item.userId);

    const listUser = await User.find({
        _id : {$in : friendsListId},
        status :"active",
    }).select("id avatar username statusOnline");

    listUser.forEach(user => {
        const infoUser = friendsList.find(friend => friend.userId == user.id) ;
        console.log(infoUser);
        user.roomChat = infoUser.roomChat ;
    })
    // console.log(listUser);
    

    res.render("client/page/users/list-friends", {
        pageTitle: "Danh sách bạn bè",
        users: listUser
      });
}
// get users/list-request
module.exports.request = async (req , res) => {
    const userId = res.locals.user.id ;
    // SocketIO
    usersSocket.usersSocket(req, res);
    // End SocketIO

    const requestFriends = res.locals.user.requestFriends;

    const listUser = await User.find({
        _id : {$in : requestFriends},
        status :"active",
    }).select("id avatar username");

    res.render("client/page/users/list-request", {
        pageTitle: "Danh sách lời mời đã gửi",
        users: listUser
      });
}
// get users/list-accept
module.exports.accept = async (req , res) => {
    const userId = res.locals.user.id ;
    // SocketIO
    usersSocket.usersSocket(req, res);
    // End SocketIO
    const acceptFriends = res.locals.user.acceptFriends;
    
    const listUser = await User.find({
        _id : {$in : acceptFriends},
        status :"active",
    }).select("id avatar username");

    res.render("client/page/users/list-accept", {
        pageTitle: "Danh sách đề cử kết bạn",
        users: listUser
      });
}