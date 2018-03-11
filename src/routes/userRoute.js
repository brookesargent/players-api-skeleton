var express = require('express');

var routes = function(User) {
  var userRouter = express.Router();
  var userController = require('../controllers/userController')(User);
  userRouter.route('/')
    .post(userController.post);

  userRouter.route('/:userId')
    .put(function(req, res) {
      var query = { _id: req.params.userId };
      var update = req.body;
      var options = { new: true, upsert: true };
      var user = User.findOneAndUpdate(query, update, options);

      if (!user) {
        res.status(500).send('fail');
      } else {
        //204 won't return a body
        res.status(200).send({'success': true, 'user': user._update});
      }
    });
  return userRouter;
};

module.exports = routes;
