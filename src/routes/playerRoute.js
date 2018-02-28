var express = require('express');
var app = require('../app');
var routes = function(Player) {
    var playerRouter = express.Router();
    var playerController = require('../controllers/playerController')(Player);
    playerRouter.route('/')
        .post(playerController.post)
        return playerRouter;
};

module.exports = routes;