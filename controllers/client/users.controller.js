const User = require("../../models/user.model")
const generate = require("../../helper/generate.helper");
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

