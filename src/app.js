var express = require('express'),
    db = require('./db');
    bodyParser = require('body-parser');

var User = require('./models/userModel');
var Player = require('./models/playerModel');

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

userRouter = require('./routes/userRoute')(User);

app.use('/api/user', userRouter);

app.get('/', function(req, res){
    res.send('welcome to my API!');
});

module.exports = app;