const express = require('express')
require('dotenv').config();
const routeClient = require("./routes/client/index.route.js")
const routeAdmin = require("./routes/admin/index.route.js")

const app = express()
const port = process.env.PORT ;


app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");


app.use(express.static(`${__dirname}/public`));


routeAdmin(app);  
routeClient(app) ;

app.listen(port, () => {
console.log(`Đang kết nối tới cổng ${port}`)
})