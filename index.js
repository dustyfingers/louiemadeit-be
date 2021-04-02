// import libs/other
const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    cookieParser = require("cookie-parser");

// import config files
const {
    dbPath,
    dbOpts
} = require("./config/db");
const secrets = require("./config/secrets");

// connect to db
mongoose.connect(dbPath, dbOpts);

// import routes
const authRoutes = require("./api/routes/auth/auth");
const userRoutes = require("./api/routes/user/user");
const trackRoutes = require("./api/routes/track/track");
const s3Routes = require("./api/routes/s3/s3");

// create express server
const server = express();

// configure cors and json
server.use(express.json());
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(cookieParser('cookies key secret junk here sgawsryserfg'));
server.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Content-Type", "application/json");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

// determine port and environment and start server
const PORT = process.env.PORT || 5000;
const ENVIRONMENT = server.get('env');

server.listen(PORT, () => {
    console.log(`ENVIRONMENT: ${ENVIRONMENT}`);
    console.log(`SERVER STARTED ON PORT: ${PORT}`);
});

// * ROUTES *
server.use("/auth", authRoutes);
server.use("/user", userRoutes);
server.use("/track", trackRoutes);
server.use("/s3", s3Routes);

// sanity route
server.get("/", (req, res) => res.send({
    msg: "INDEX"
}));