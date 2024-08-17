const express = require("express");
const route = express.Router() ;
const validate = require("../../validate/validate.js");

const controller = require("../../controllers/client/users.controller");
route.get("/register" , controller.register);
route.post("/register" , validate.validateFormRegister,controller.registerPost)
route.get("/login" , controller.login);
route.post("/login" , validate.validateFormLogin,controller.loginPost);
module.exports = route ;