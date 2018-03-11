var express = require('express');
var app = require('../app');
var auth = require('../auth/auth');
var Player = require('../models/Player');
var calculations = require('../helpers/calculations');

var routes = function(Match) {
    var matchRouter = express.Router();
    var matchController = require('../controllers/matchController')(Match);
    matchRouter.route('/')
        .post(matchController.post)
        .get(matchController.get)

        matchRouter.use('/rankings', async function(req, res, next){
            var authorization = req.get('authorization');
    
            if (authorization == null) {
                return res.status('403').send('Token is null');
            }
    
            var user = await auth.user(authorization);

            next();
        });

        matchRouter.route('/rankings')
        .get(async function(req,res){
           //get an array of ALL players
           var players = await Player.find();
           var rankings = [];

           //foreach player in players
           for (var player of players) {
            var totalGames = await calculations.getTotalGames(player.id);

            if (totalGames === 0) {
                continue;
            }
            var winningGames = await calculations.getWinningGames(player.id);
            var winPercentage = await calculations.calculateWinningPercentage(totalGames, winningGames);
            var playerRank = {player: player.id, winPercentage: winPercentage};
            rankings.push(playerRank);
           }

           //sort rankings highest percentage to lowest
           rankings.sort(function(a, b) {
            return parseFloat(b.winPercentage) - parseFloat(a.winPercentage);
            });

            return res.status(200).send({'success': true, 'rankings': rankings});
        });

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
            var totalGames = await calculations.getTotalGames(req.player.id);
            var winningGames = await calculations.getWinningGames(req.player.id);
            var losingGames = totalGames - winningGames;
            return res.status(200).send({'success': true, 'wins': winningGames, 'losses': losingGames});
        });
    return matchRouter;
};



module.exports = routes;