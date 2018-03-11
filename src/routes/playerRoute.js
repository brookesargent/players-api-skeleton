var express = require('express');
var auth = require('../auth/auth');

var routes = function(Player) {
  var playerRouter = express.Router();
  var playerController = require('../controllers/playerController')(Player);
  playerRouter.use(auth.isAuthorized);
  playerRouter.route('/')
    .post(playerController.post)
    .get(playerController.get);

  playerRouter.use('/:id', async function(req, res, next) {
    var user = await auth.user(req, res, next);

    Player.findById(req.params.id, function(err, player) {
      if (player === null || player === undefined) {
        res.status(404).send('No player found.');
      } else if (player.created_by !== user.id) {
        res.status(404).send('Player created by another user');
      } else if (err) { res.status(500).send(err); } else {
        req.player = player;
        next();
      }
    });
  });

  playerRouter.route('/:id')
    .delete(function(req, res) {
      req.player.remove(function(err) {
        if (err) { return res.status(500).send(err); }

        return res.status(200).send({'success': true});

      });
    });
  return playerRouter;
};

module.exports = routes;