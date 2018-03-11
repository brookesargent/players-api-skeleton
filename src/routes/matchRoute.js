var express = require('express');
var auth = require('../auth/auth');
var Player = require('../models/Player');
var calculations = require('../helpers/calculations');

var routes = function(Match) {
  var matchRouter = express.Router();
  var matchController = require('../controllers/matchController')(Match);
  matchRouter.use(auth.isAuthorized);
  matchRouter.route('/')
    .post(matchController.post)
    .get(matchController.get);

  matchRouter.route('/rankings')
    .get(async function(req, res) {
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

  matchRouter.use('/:playerId', async function(req, res, next) {
    Player.findById(req.params.playerId, function(err, player) {
      if (player === null || player === undefined) {
        res.status(404).send('No player found.');
      } else if (err) {
        res.status(500).send(err);
      } else {
        req.player = player;
        next();
      }
    });
  });

  matchRouter.route('/:playerId')
    .get(async function(req, res) {
      var totalGames = await calculations.getTotalGames(req.player.id);
      var winningGames = await calculations.getWinningGames(req.player.id);
      var losingGames = totalGames - winningGames;
      return res.status(200).send({'success': true, 'wins': winningGames, 'losses': losingGames});
    });
  return matchRouter;
};



module.exports = routes;