const express = require('express')
require('dotenv').config();
const routeClient = require("./routes/client/index.route.js")
const routeAdmin = require("./routes/admin/index.route.js")
const database = require("./config/database");
const app = express()
const port = process.env.PORT ;
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

// socket init
const http = require('http');
const { Server } = require("socket.io");


database.connect();
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use(express.static(`${__dirname}/public`));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(cookieParser())

// Socket io
const server = http.createServer(app) ;
const io = new Server(server) ;
global._io = io ; // tạo biết toàn cục tới các file controller , js bên backend
//end socket io


routeAdmin(app);  
routeClient(app) ;

server.listen(port, () => {
console.log(`Đang kết nối tới cổng ${port}`)
})