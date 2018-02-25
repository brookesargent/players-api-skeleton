var userController = function(User) {
    //creates a new user
    var post = function(req, res) {

        if (req.body.password !== req.body.confirm_password) {
            res.status(400).send('Passwords do not match');
        }
       
        User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password
        }, function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database");
            res.status(200).send(user);
        });
    }

    return {
        post: post
    }
}

module.exports = userController;