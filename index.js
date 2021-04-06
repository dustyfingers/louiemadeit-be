// import libs/other
const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    cookieParser = require("cookie-parser"),
    cors = require("cors"),
    session = require("express-session"),
    MongoDBSession = require("connect-mongodb-session")(session);

// import config files
const {
    dbPath,
    dbOpts
} = require("./config/db");
const secrets = require("./config/secrets");

console.log('server started!')

// connect to db
mongoose.connect(dbPath, dbOpts);

console.log('db connection happens!')

// create session store
const store = MongoDBSession({
    uri: dbPath,
    collection: 'sessions'
});

// import routes
const authRoutes = require("./api/routes/auth/auth");
const userRoutes = require("./api/routes/user/user");
const trackRoutes = require("./api/routes/track/track");
const s3Routes = require("./api/routes/s3/s3");

// create express server
const server = express();

// configure middlewares
server.use(express.json());
server.use(session({
    secret: secrets.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store
}));
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(cookieParser());

// TODO: this should change depending on env!
server.use(cors({ origin: "http://localhost:3000", credentials: true }));

server.use(function(req, res, next) {
    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
})

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
server.get("/", (req, res) => {
    // // ! important
    req.session.isAuth = true;
    // console.log(req.session);
    res.send({ msg: "INDEX" });
}
);