const express = require('express')
require('dotenv').config();
const routeClient = require("./routes/client/index.route.js")
const routeAdmin = require("./routes/admin/index.route.js")
const database = require("./config/database");
const app = express()
const port = process.env.PORT ;
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')


database.connect();
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use(express.static(`${__dirname}/public`));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(cookieParser())


routeAdmin(app);  
routeClient(app) ;

app.listen(port, () => {
console.log(`Đang kết nối tới cổng ${port}`)
})