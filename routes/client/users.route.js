const express = require("express");
const route = express.Router() ;

const controller = require("../../controllers/client/users.controller");
route.get("/register" , controller.register);
route.get("/login" , controller.login);
module.exports = route ;