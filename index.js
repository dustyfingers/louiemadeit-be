// import libs/other
const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    cookieParser = require("cookie-parser"),
    passport = require("passport"),
    cors = require("cors"),
    session = require("express-session"),
    bcrypt = require("bcryptjs"),
    MongoDBSession = require("connect-mongodb-session")(session);

// import config files
const dbOpts= require("./config/db"),
    env = require("./config/env");

const User = require("./api/models/User");

// connect to db & create session store
mongoose.connect(env.dbPath, dbOpts);
const store = MongoDBSession({
    uri: env.dbPath,
    collection: 'sessions'
});

// import routes
const authRoutes = require("./api/routes/auth/auth");
const userRoutes = require("./api/routes/user/user");
const trackRoutes = require("./api/routes/track/track");
const s3Routes = require("./api/routes/s3/s3");
const stripeRoutes = require("./api/routes/stripe/checkout");

// create express server & config middleware
const server = express();
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors({ origin: env.origin, credentials: true }));
server.use(session({
    secret: env.sessionSecret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 86400,
        httpOnly: true
    },
    store
}));

// passport setup
server.use(passport.initialize());
server.use(passport.session());
require("./config/passportConfig")(passport);

// determine port and environment and start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`SERVER STARTED ON PORT: ${PORT}`));

// * ROUTES 
server.use("/auth", authRoutes);
server.use("/user", userRoutes);
server.use("/track", trackRoutes);
server.use("/s3", s3Routes);
server.use("/stripe", stripeRoutes);