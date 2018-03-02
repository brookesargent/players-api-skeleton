var jwt = require('jwt-simple');
var config = require('../auth/dbConfig');
var User = require('../models/User');

var playerController = function(Player) {
    var post = async function(req, res) {
        var playerid;
        var player = await Player.findOne({first_name: req.body.first_name, last_name: req.body.last_name}).exec();

        if (player) {
            return res.status(409).send('Player with name already exists');
        }
            

        //add some error handling here

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
                console.log("user id who created player: " + userid);
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

    var get = async function(req, res) {
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

        var user = await User.findOne({ _id: decoded.id }).exec();

        var players = await Player.find({created_by: user._id}).exec();

        if (players) {
            return res.status(200).send({'success': true, 'players': players});
        }
    }

    return {
        post: post,
        get: get
    }
}


module.exports = playerController;