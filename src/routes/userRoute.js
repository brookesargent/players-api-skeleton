var express = require('express');

var routes = function(User) {
    var userRouter = express.Router();
    var userController = require('../controllers/userController')(User);
    userRouter.route('/')
        .post(userController.post)
        return userRouter;
};

module.exports = routes;
