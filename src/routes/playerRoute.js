var express = require('express');
var app = require('../app');
var jwt = require('jwt-simple');
var config = require('../auth/dbConfig');
var User = require('../models/User');

var routes = function(Player) {
    var playerRouter = express.Router();
    var playerController = require('../controllers/playerController')(Player);
    playerRouter.route('/')
        .post(playerController.post)
        .get(playerController.get)

        playerRouter.use('/:id', function(req, res, next){
        var authorization = req.get('authorization');

        if (authorization == null) {
            return res.status('403').send('Token is null');
        }

        var token = authorization.split('Bearer ')[1];
        var userid;

        var decoded = jwt.decode(token,
        config.secret);

        if (decoded.exp <= Date.now()) {
            //res.status('409').send('Access token has expired');
        }

        User.findOne({ _id: decoded.id }, function(err, user) {
            if (user) {
                userid = user.id;
            } 
        });

            Player.findById(req.params.id, function(err, player) {
                if (player == null) {
                    res.status(404).send('No player found.');
                }

                else if (player.created_by != userid) {
                    res.status(404).send('Player created by another user');
                }
                else if (err) 
                 res.status(500).send(err);

                 else {
                    req.player = player;
                    next();
                 }
            });
        });

        playerRouter.route('/:id')
        .delete(function(req,res){
            req.player.remove(function(err){
                if(err)
                    return res.status(500).send(err);
                else{
                    return res.status(200).send({'success': true});
                }
            });
        });
        return playerRouter;
};

module.exports = routes;