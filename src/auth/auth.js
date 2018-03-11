var jwt = require('jwt-simple');
var config = require('./dbConfig');
var User = require('../models/User');

var user = async function(req, res) {
  var authorization = req.get('authorization');
  var token = authorization.split('Bearer ')[1];

  var decoded = jwt.decode(token,
    config.secret);

  return await User.findOne({ _id: decoded.id }).exec();
};

var isAuthorized = async function(req, res, next) {
  var authorization = await req.get('authorization');
  if (authorization === null || authorization === undefined) {
    var err = new Error('Token is null');
    err.status = 403;
    return next(err);
  }

  var token = authorization.split('Bearer ')[1];

  var decoded = jwt.decode(token,
    config.secret);

  User.findById(decoded.id).exec(function(error, user) {
    if (error) {
      return next(error);
    } else {
      if (user === null) {
        var err = new Error('Not authorized');
        err.status = 403;
        return next(err);
      }
      return next();
    }
  });


  req.decoded = await User.findOne({ _id: decoded.id }).exec();
  return;
};

exports.user = user;
exports.isAuthorized = isAuthorized;