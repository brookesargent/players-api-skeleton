var auth = require('../auth/auth');
var User = require('../models/User'); 
var Player = require('../models/Player');
var ObjectId = require('mongodb').ObjectID;

var matchController = function(Match) {
    var post = async function(req, res) {
        var authorization = req.get('authorization');

        if (authorization == null) {
            return res.status('403').send('Token is null');
        }

        var user = await auth.user(authorization);

        var player1 = await Player.findOne({_id: new ObjectId(req.body.player1)}).exec();
        
        if (player1 == null) {
            return res.status('409').send('Player 1 could not be found');
        }
        var player2 = await Player.findOne({_id: new ObjectId(req.body.player2)}).exec();

        if (player2 == null) {
            return res.status('409').send('Player 2 could not be found');
        }
        if (player1.created_by == player2.created_by) {
            return res.status(409).send('Players are on the same team');
        }

        Match.create({
          player1: req.body.player1,
          player2: req.body.player2,
          player1_score: parseInt(req.body.player1_score),
          player2_score: parseInt(req.body.player2_score),
          winner: req.body.winner
        }, function(err, match) {
            if (err){
                return res.status(409).send(err.message);
            }
            

            res.status(201).send({
                "success": true,
                "match": match
            });
        });
    }
    return {
        post: post
    }
}

module.exports = matchController;