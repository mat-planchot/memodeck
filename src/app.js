const express = require("express");
const cors = require("cors");
const path = require('path');
const HttpException = require('./utils/HttpException.utils');
const errorMiddleware = require('./middleware/error.middleware');
const websiteRouter = require('./routes/website.route');
const userRouter = require('./routes/user.route');
const deckRouter = require('./routes/deck.route');
const cardRouter = require('./routes/card.route');
const session = require('express-session');
let MemoryStore = require('memorystore')(session);

// Init express
const app = express();

app.use(session({
    secret: 'dqsxieajzksvcr',
    cookie: {
        secure: false, // if true only transmit cookie over https
        maxAge: 24*60*60*1000, // session max age in milliseconds
        httpOnly: false // if true prevent client side JS from reading the cookie 
    },
    store: new MemoryStore({
        checkPeriod: 24*60*60*1000 // prune expired entries every 24h
      }),
    saveUninitialized: false,
    resave: false
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// parse requests of content-type: application/json
// parses incoming requests with JSON payloads
app.use(express.static(path.join(__dirname + 'public')));
// to include static files
app.use(express.static(__dirname + '/public'));
app.use(express.json());
// enabling cors for all requests by using cors middleware
app.use(cors());
// Enable pre-flight
app.options("*", cors());

app.use(`/`, websiteRouter);
app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/decks`, deckRouter);
app.use(`/api/v1/cards`, cardRouter);

// 404 error
app.all('*', (req, res, next) => {
    const err = new HttpException(404, 'Endpoint Not Found');
    next(err);
});

// Error middleware
app.use(errorMiddleware);

module.exports = app;