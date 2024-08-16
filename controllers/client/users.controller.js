const User = require("../../models/user.model")

module.exports.register = async (req , res) => {
    res.render("client/page/users/register.pug")
}

module.exports.login = async (req , res) => {
    res.render("client/page/users/login.pug")
}