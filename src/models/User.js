var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var userModel = new Schema({
  first_name: { type: String,
    required: true },
  last_name: { type: String,
    required: true },
  email: { type: String,
    required: true,
    unique: true},
  password: { type: String,
    required: true }
});

// Duplicate the ID field.
userModel.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userModel.set('toJSON', {
  virtuals: true
});

//hash password
userModel.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });


});

module.exports = mongoose.model('User', userModel);
