// import libs/other
const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

// import config files
const {
    dbPath,
    dbOpts
} = require("./config/db");
const secrets = require("./config/secrets");

// connect to db
mongoose.connect(dbPath, dbOpts);

// import routes
// const authRoutes = require("./routes/auth/auth");

// create express server
const server = express();

// configure cors and json
server.use(express.json());
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Content-Type", "application/json");
    next();
});

// determine port and start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`ENVIRONMENT: ${secrets.environment}`);
    console.log(`SERVER STARTED ON PORT: ${PORT}`);
});

// * ROUTES *
// server.use("/auth", authRoutes);

// index route
server.get("/", (req, res) => res.send({
    msg: "INDEX"
}));