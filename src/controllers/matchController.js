<<<<<<< HEAD
=======
var auth = require('../auth/auth');
>>>>>>> 9082c168a7395eb4db1d846bde232761c91cc584
var Player = require('../models/Player');
var ObjectId = require('mongodb').ObjectID;
var calculations = require('../helpers/calculations');

var matchController = function(Match) {
  var post = async function(req, res) {
<<<<<<< HEAD
    var player1 = await Player.findOne({_id: new ObjectId(req.body.player1)}).exec();

    if (player1 === null) {
      return res.status('409').send('Player 1 could not be found');
=======
    var authorization = req.get('authorization');

    if (authorization === null) {
      return res.status('403').send('Token is null');
>>>>>>> 9082c168a7395eb4db1d846bde232761c91cc584
    }
    var player2 = await Player.findOne({_id: new ObjectId(req.body.player2)}).exec();

<<<<<<< HEAD
=======
    await auth.user(authorization);

    var player1 = await Player.findOne({_id: new ObjectId(req.body.player1)}).exec();

    if (player1 === null) {
      return res.status('409').send('Player 1 could not be found');
    }
    var player2 = await Player.findOne({_id: new ObjectId(req.body.player2)}).exec();

>>>>>>> 9082c168a7395eb4db1d846bde232761c91cc584
    if (player2 === null) {
      return res.status('409').send('Player 2 could not be found');
    }
    if (player1.created_by === player2.created_by) {
      return res.status(409).send('Players are on the same team');
<<<<<<< HEAD
    }

    Match.create({
      player1: req.body.player1,
      player2: req.body.player2,
      player1_score: parseInt(req.body.player1_score),
      player2_score: parseInt(req.body.player2_score),
      winner: req.body.winner
    }, function(err, match) {
      if (err) {
        return res.status(409).send(err.message);
      }

      res.status(201).send({
        'success': true,
        'match': match
      });

      calculations.updatePlayerRating(player1, player2, match.winner);
    });
  };

  var get = async function(req, res) {
=======
    }

    Match.create({
      player1: req.body.player1,
      player2: req.body.player2,
      player1_score: parseInt(req.body.player1_score),
      player2_score: parseInt(req.body.player2_score),
      winner: req.body.winner
    }, function(err, match) {
      if (err) {
        console.log(err.message);
        return res.status(409).send(err.message);
      }

      res.status(201).send({
        'success': true,
        'match': match
      });

      calculations.updatePlayerRating(player1, player2, match.winner);
    });
  };

  var get = async function(req, res) {
    var authorization = req.get('authorization');

    if (authorization === null) {
      return res.status('403').send('Token is null');
    }

    await auth.user(authorization);

>>>>>>> 9082c168a7395eb4db1d846bde232761c91cc584
    var matches = await Match.find().exec();

    if (matches) {
      return res.status(200).send({'success': true, 'matches': matches});
    }
  };

  return {
    post: post,
    get: get
  };
};

module.exports = matchController;