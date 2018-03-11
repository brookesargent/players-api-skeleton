var auth = require('../auth/auth');

var playerController = function(Player) {
  var post = async function(req, res) {
    var player = await Player.findOne({first_name: req.body.first_name, last_name: req.body.last_name}).exec();

    if (player) {
      return res.status(409).send('Player with name already exists');
    }

    var user = await auth.user(req, res);

    Player.create({
      created_by: user.id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      rating: parseInt(req.body.rating),
      handedness: req.body.handedness
    }, function(err, player) {
      if (err) { return res.status(409).send(err.message); }

      res.status(201).send({
        'success': true,
        'player': player
      });
    });
  };

  var get = async function(req, res) {
    var user = await auth.user(req, res);

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