var auth = require('../auth/auth');
<<<<<<< HEAD

=======
>>>>>>> 9082c168a7395eb4db1d846bde232761c91cc584

var playerController = function(Player) {
  var post = async function(req, res) {
    var player = await Player.findOne({first_name: req.body.first_name, last_name: req.body.last_name}).exec();

    if (player) {
      return res.status(409).send('Player with name already exists');
    }

<<<<<<< HEAD
    var user = await auth.user(req, res);

    Player.create({
      created_by: user.id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      rating: parseInt(req.body.rating),
      handedness: req.body.handedness
    }, function(err, player) {
      if (err) { return res.status(409).send(err.message); }

=======
    var authorization = req.get('authorization');

    if (authorization === null) {
      return res.status('403').send('Token is null');
    }

    var user = await auth.user(authorization);
    Player.create({
      created_by: user.id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      rating: parseInt(req.body.rating),
      handedness: req.body.handedness
    }, function(err, player) {
      if (err) { return res.status(409).send(err.message); }

>>>>>>> 9082c168a7395eb4db1d846bde232761c91cc584
      res.status(201).send({
        'success': true,
        'player': player
      });
    });
  };
<<<<<<< HEAD

  var get = async function(req, res) {
    var user = await auth.user(req, res);
=======

  var get = async function(req, res) {
    var authorization = req.get('authorization');

    if (authorization === null) {
      return res.status('403').send('Token is null');
    }

    var user = await auth.user(authorization);
>>>>>>> 9082c168a7395eb4db1d846bde232761c91cc584

    var players = await Player.find({created_by: user._id}).exec();

    if (players) {
      return res.status(200).send({'success': true, 'players': players});
    }
  };

  return {
    post: post,
    get: get
  };
};

module.exports = playerController;