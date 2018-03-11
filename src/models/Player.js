var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerModel = new Schema({
  created_by: { type: String },
  first_name: { type: String,
    required: true },
  last_name: { type: String,
    required: true},
  rating: { type: Number,
    required: true },
  handedness: { type: String, enum: ['left', 'right'],
    required: true}
});

// Duplicate the ID field.
playerModel.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
playerModel.set('toJSON', {
  virtuals: true
});


module.exports = mongoose.model('Player', playerModel);
