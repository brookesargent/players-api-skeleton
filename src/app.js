var express = require('express'),
    db = require('./db');
    bodyParser = require('body-parser');

var User = require('./models/User');
var Player = require('./models/Player');

var app = express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var userRouter = require('./routes/userRoute')(User);
app.use('/api/user', userRouter);

var authRouter = require('./routes/authRoute')(User);
app.use('/api/login', authRouter);


module.exports = app;