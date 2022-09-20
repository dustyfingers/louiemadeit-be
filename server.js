require('dotenv').config();

const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    cors = require('cors'),
    session = require('express-session'),
    MongoDBSession = require('connect-mongodb-session')(session);

const dbOpts = require('./config/db'),
    envConfig = require('./config/env');

const authRoutes = require('./routes/auth'),
    userRoutes = require('./routes/user'),
    trackRoutes = require('./routes/track'),
    s3Routes = require('./routes/s3'),
    stripeRoutes = require('./routes/stripe'),
    packRoutes = require('./routes/pack');

const corsWhitelist = [envConfig.origin, undefined];

// * connect to db & create session store
mongoose.connect(envConfig.dbPath, dbOpts);
const store = MongoDBSession({
    uri: envConfig.dbPath,
    collection: 'sessions',
});

// * create express server & config middleware (cors, sessions, etc)
const server = express();
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser(envConfig.sessionSecret));
server.use(
    cors({
        origin: (og, cb) => {
            if (corsWhitelist.indexOf(og) !== -1) cb(null, true);
            else cb(new Error('Not allowed by CORS'));
        },
        credentials: true,
    })
);
server.use(
    session({
        secret: envConfig.sessionSecret,
        saveUninitialized: false,
        resave: true,
        rolling: true,
        proxy: envConfig.origin === 'http://localhost:3000' ? undefined : true,
        cookie: {
            maxAge: 86400000,
            sameSite: envConfig.sameSite,
            secure: envConfig.secure,
            httpOnly: true,
        },
        store,
    })
);

// * passport setup
server.use(passport.initialize());
server.use(passport.session());
require('./config/passportConfig')(passport);

// * ROUTES
server.use('/auth', authRoutes);
server.use('/user', userRoutes);
server.use('/tracks', trackRoutes);
server.use('/s3', s3Routes);
server.use('/stripe', stripeRoutes);
server.use('/packs', packRoutes);

module.exports = server;
