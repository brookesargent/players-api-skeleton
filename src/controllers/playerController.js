var jwt = require('jwt-simple');
var config = require('../auth/dbConfig');
var User = require('../models/User');

var playerController = function(Player) {
    var post = function(req, res) {
        var authorization = req.get('authorization');

        if (authorization == null) {
            return res.status('403').send('Token is null');
        }

        var token = authorization.split('Bearer ')[1];
        var userid;

        //verify token
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


        //check that first and last name combo doesn't already exist
        Player.findOne({first_name: req.body.first_name, last_name: req.body.last_name}, function(err, player){
            if (player) {
                return res.status(409).send('Player with name already exists');
            }
       });

        Player.create({
          created_by: userid,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          rating: parseInt(req.body.rating),
          handedness: req.body.handedness
        }, function(err, player) {
            if (err)
            return res.status(409).send(err.message);

            res.status(201);
            res.json({
                success: true,
                player: player
            });
        });
    }

    return {
        post: post
    }
}


module.exports = playerController;