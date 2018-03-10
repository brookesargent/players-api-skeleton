var express = require('express');
var app = require('../app');
var auth = require('../auth/auth');
var Player = require('../models/Player');
var routes = function(Match) {
    var matchRouter = express.Router();
    var matchController = require('../controllers/matchController')(Match);
    matchRouter.route('/')
        .post(matchController.post)
        .get(matchController.get)

        matchRouter.use('/:playerId', async function(req, res, next){
            var authorization = req.get('authorization');
    
            if (authorization == null) {
                return res.status('403').send('Token is null');
            }
    
            var user = await auth.user(authorization);
            Player.findById(req.params.playerId, function(err, player) {
                if (player == null) {
                    res.status(404).send('No player found.');
                }

                else if (err) {
                    res.status(500).send(err);
                }
                    
                else {
                req.player = player;
                next();
                }
            });
        });
    
        matchRouter.route('/:playerId')
        .get(async function(req,res){
            var matches = await Match.find({
                "$or": [{
                    "player1": req.player.id
                }, {
                    "player2": req.player.id
                }]
            });

            var wins = [];
            var losses = [];

            matches.forEach(match => {
                if (match.winner === req.player.id) {
                    wins.push(match);
                } else {
                    losses.push(match);
                }
            });         
            return res.status(200).send({'success': true, 'wins': wins.length, 'losses': losses.length});
        });
    return matchRouter;
};

module.exports = routes;