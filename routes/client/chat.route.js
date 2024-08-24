const express = require("express");
const route = express.Router() ;

const controller = require("../../controllers/client/chat.controller");
const chatMiddleware = require("../../middleware/client/chat.middleware");

route.get("/:roomChat", chatMiddleware.isAccess,controller.index);
module.exports = route ;