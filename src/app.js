var express = require('express');
var bodyParser = require('body-parser');

var User = require('./models/User');
var Player = require('./models/Player');
var Match = require('./models/Match');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var userRouter = require('./routes/userRoute')(User);
app.use('/api/user', userRouter);

var authRouter = require('./routes/authRoute')(User);
app.use('/api/login', authRouter);

var playerRouter = require('./routes/playerRoute')(Player);
app.use('/api/players', playerRouter);

var matchRouter = require('./routes/matchRoute')(Match);
app.use('/api/match', matchRouter);

module.exports = app;