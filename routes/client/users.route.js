const express = require("express");
const route = express.Router() ;
const validate = require("../../validate/validate.js");
var multer = require('multer');
var upload = multer();
const uploadMiddleware = require("../../middleware/client/uploadSingle.middleware.js");

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
route.get("/profile" , controller.profile);
route.post("/profile/edit",upload.single('avatar') , uploadMiddleware.uploadSingle , controller.profilePost);



route.get("/friend-recomendation-list" , controller.friendRecomendation)
route.get("/list-friends" , controller.friends)
route.get("/list-request" , controller.request)
route.get("/list-accept" , controller.accept)


module.exports = route ;