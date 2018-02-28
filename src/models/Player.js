var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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

module.exports = mongoose.model('Player', playerModel);
