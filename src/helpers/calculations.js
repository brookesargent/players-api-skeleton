var Match = require('../models/Match');
var Player = require('../models/Player');

function calculatePointSpread(player1Rating, player2Rating) {
    var pointSpread;

    if (player1Rating > player2Rating) {
        pointSpread = player1Rating - player2Rating;
    } else {
        pointSpread = player2Rating - player1Rating;
    }

    return pointSpread;
}

function calculateHigherRatedPlayer(player1, player2) {
    var higherRatedPlayer;

    if (player1.rating > player2.rating) {
        higherRatedPlayer = player1.id;
    } else {
        higherRatedPlayer = player2.id;
    }

    return higherRatedPlayer;
}

module.exports = {
    getTotalGames: async function(playerId) {
        var matches = await Match.find({
            "$or": [{
                "player1": playerId
            }, {
                "player2": playerId
            }]
        });
        return matches.length;
    },
    getWinningGames: async function(playerId) {
        var matches = await Match.find({
            "$or": [{
                "player1": playerId
            }, {
                "player2": playerId
            }]
        });
    
        var wins = [];
    
        matches.forEach(match => {
            if (match.winner === playerId) {
                wins.push(match);
            } 
        });     
    
        return wins.length;
    },
    calculateWinningPercentage: function(totalGames, winningGames) {
        var winPercentage = (winningGames/totalGames) * 100;
     
        return winPercentage;
     },
    updatePlayerRating: async function(player1, player2, winner) {
        var pointSpread = calculatePointSpread(player1.rating, player2.rating);
        var higherRatedPlayer = calculateHigherRatedPlayer(player1, player2);
        var pointsExchanged = 0;
        
        if (0 <= pointSpread && pointSpread < 12) {
            pointsExchanged = 8;
        } else if(13 <= pointSpread && pointSpread < 37) {
            if (higherRatedPlayer == winner) {
                pointsExchanged = 7;
            } else {
                pointsExchanged = 10;
            }
        } else if (38 <= pointSpread && pointSpread < 62) {
            if (higherRatedPlayer == winner) {
                pointsExchanged = 6;
            } else {
                pointsExchanged = 13;
            }
        } else if (63 <= pointSpread && pointSpread < 87) {
            if (higherRatedPlayer == winner) {
                pointsExchanged = 5;
            } else {
                pointsExchanged = 16;
            }
        } else if (88 <= pointSpread && pointSpread < 112) {
            if (higherRatedPlayer == winner) {
                pointsExchanged = 4;
            } else {
                pointsExchanged = 20;
            }
        } else if (113 <= pointSpread && pointSpread < 137) {
            if (higherRatedPlayer == winner) {
                pointsExchanged = 3;
            } else {
                pointsExchanged = 25;
            }
        } else if (138 <= pointSpread && pointSpread < 162) {
            if (higherRatedPlayer == winner) {
                pointsExchanged = 2;
            } else {
                pointsExchanged = 30;
            }
        } else if (163 <= pointSpread && pointSpread < 187) {
            if (higherRatedPlayer == winner) {
                pointsExchanged = 2;
            } else {
                pointsExchanged = 35;
            }
        } else if (188 <= pointSpread && pointSpread < 212) {
            if (higherRatedPlayer == winner) {
                pointsExchanged = 1;
            } else {
                pointsExchanged = 40;
            }
        } else if (213 <= pointSpread && pointSpread < 237) {
            if (higherRatedPlayer == winner) {
                pointsExchanged = 1;
            } else {
                pointsExchanged = 45;
            }
        } else if (238 <= pointSpread) {
            if (higherRatedPlayer == winner) {
                pointsExchanged = 0;
            } else {
                pointsExchanged = 50;
            }
        }

        var newRating;
        if (player1.id == winner) {
            newRating = player1.rating + pointsExchanged;
        } else {
            newRating = player2.rating + pointsExchanged;
        }

        //update winner to increase rating by pointsExchanged
        var query   = { _id: winner }; 
        var update  =  { rating: newRating };
        var options = { new: true, upsert: true }; 
        var player = await Player.findOneAndUpdate(query, update, options);
    }
    
}