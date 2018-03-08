var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var matchModel = new Schema({
  created_by: { type: String },
  player1: { type: String,
             required: true },
  player2: { type: String,
             required: true},
  player1_score: { type: Number,
                   required: true },
  player2_score: { type: Number,
                   required: true },
  winner: { type: String,
            required: true }
});

module.exports = mongoose.model('Match', matchModel);
