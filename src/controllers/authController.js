var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var config = require('../auth/dbConfig');

var authController = function(User) {
  var post = function(req, res) {
    User.findOne({ email: req.body.email },
      function(err, user) {
        if (err) return res.status(500).send('Error on the server');
        if (!user) return res.status(401).send('No user found');

        var validPassword = bcrypt.compareSync(req.body.password, user.password);
        if (!validPassword) return res.status(401).send({ auth: false, token: null });

        var token = jwt.sign({ id: user._id}, config.secret, {
          expiresIn: 86400
        });
        res.status(200).send({
          'success': true,
          'user': user,
          'token': token
        });
      });
  };

  return {
    post: post
  };
};

module.exports = authController;