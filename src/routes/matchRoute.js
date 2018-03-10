var express = require('express');
var app = require('../app');
var auth = require('../auth/auth');

var routes = function(Match) {
    var matchRouter = express.Router();
    var matchController = require('../controllers/matchController')(Match);
    matchRouter.route('/')
        .post(matchController.post)

    return matchRouter;
};

module.exports = routes;