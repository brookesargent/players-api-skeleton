var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var playerModel = new Schema({
  createdby: { type: String },
  first_name: { type: String },
  last_name: { type: String},
  rating: { type: Number },
  handedness: { type: String, enum: ['left', 'right']}
});

module.exports = mongoose.model('Player', playerModel);
