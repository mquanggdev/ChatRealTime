const homeRoute = require("./home.route");
const userRoute = require("./users.route");
module.exports = (app) => {
    app.use("/" , homeRoute);
    app.use("/users" , userRoute);
} ;