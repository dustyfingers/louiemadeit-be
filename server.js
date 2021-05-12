require('dotenv').config()

// import libs/other
const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    cookieParser = require("cookie-parser"),
    passport = require("passport"),
    cors = require("cors"),
    session = require("express-session"),
    MongoDBSession = require("connect-mongodb-session")(session);

// import config files
const dbOpts = require("./config/db"),
    env = require("./config/env");

// import routes
const authRoutes = require("./api/routes/auth/auth"),
    userRoutes = require("./api/routes/user/user"),
    trackRoutes = require("./api/routes/track/track"),
    s3Routes = require("./api/routes/s3/s3"),
    stripeRoutes = require("./api/routes/stripe/checkout");

const corsWhitelist = [env.origin, undefined];

// connect to db & create session store
mongoose.connect(env.dbPath, dbOpts);
const store = MongoDBSession({
    uri: env.dbPath,
    collection: 'sessions'
});

// create express server & config middleware
const server = express();
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser(env.sessionSecret));
server.use(cors({ origin: (og, cb) => {
    if (corsWhitelist.indexOf(og) !== -1) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
}, credentials: true }));
server.use(session({
    secret: env.sessionSecret,
    resave: true,
    saveUninitialized: true,
    proxy: env.origin === 'http://localhost:3000' ? undefined : true,
    cookie: {
        maxAge: 86400,
        sameSite: env.sameSite,
        secure: env.secure,
        httpOnly: true
    },
    store
}));

// passport setup
server.use(passport.initialize());
server.use(passport.session());
require("./config/passportConfig")(passport);

// * ROUTES 
server.use("/auth", authRoutes);
server.use("/user", userRoutes);
server.use("/track", trackRoutes);
server.use("/s3", s3Routes);
server.use("/stripe", stripeRoutes);

module.exports = server;