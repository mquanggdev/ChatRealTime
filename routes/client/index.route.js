const homeRoute = require("./home.route");
const userRoute = require("./users.route");
const dashboardRoute = require("./dashboard.route");
const usersMiddleware = require("../../middleware/client/users.middleware") ;
module.exports = (app) => {
    app.use(usersMiddleware.infoUser);

    app.use("/" , homeRoute);
    app.use("/users" , userRoute);
    app.use("/dashboard" , dashboardRoute);
} ;