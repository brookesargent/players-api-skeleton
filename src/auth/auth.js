var jwt = require('jwt-simple');
var config = require('./dbConfig');
var User = require('../models/User');

var user = async function(authorization) {
  var token = authorization.split('Bearer ')[1];
  var decoded = jwt.decode(token,
    config.secret);

  return await User.findOne({ _id: decoded.id }).exec();
};

exports.user = user;