const express = require("express");
const route = express.Router() ;
const validate = require("../../validate/validate.js");

const controller = require("../../controllers/client/users.controller");
route.get("/register" , controller.register);
route.post("/register" , validate.validateFormRegister,controller.registerPost)
route.get("/login" , controller.login);
route.post("/login" , validate.validateFormLogin,controller.loginPost);
route.get("/logout" ,controller.logout);
route.get("/forgot" , controller.forgot);
route.post("/forgot" , controller.forgotPost);
route.get("/otp" , controller.otpEnter);
route.post("/otp" , controller.otpEnterPost);
route.get("/resetPassword" , controller.reset);
route.patch("/resetPassword" , controller.resetPost);
module.exports = route ;