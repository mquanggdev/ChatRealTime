const express = require("express");
const route = express.Router() ;

const controller = require("../../controllers/client/chat.controller");
route.get("/:roomChat",controller.index);
module.exports = route ;