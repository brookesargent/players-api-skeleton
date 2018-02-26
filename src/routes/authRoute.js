var express = require('express');

var routes = function(User) {
    var authRouter = express.Router();
    var authController = require('../controllers/authController')(User);
    authRouter.route('/')
        .post(authController.post)
        return authRouter;
};

  
module.exports = routes;