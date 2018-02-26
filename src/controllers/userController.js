var jwt = require('jsonwebtoken');
var config = require('../config');

var userController = function(User) {
    //creates a new user
    var post = function(req, res) {
        if (req.body.password !== req.body.confirm_password) {
            return res.status(409).send('Passwords do not match');
        }

        User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password
        }, function (err, user) {

            if (err) 
            return res.status(409).send(err.message);
            
            //no errors
            //need to generate token and format response
            const payload = {
                id: user._id
            };
            var token = jwt.sign(payload, config.secret, {
                expiresIn: 1440
            });
            res.status(201);
            res.json({
                success: true,
                user: user,
                token: token
            });
        });
    }

    return {
        post: post
    }
}

module.exports = userController;