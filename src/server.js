var app = require('./app');
var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Gulp is running my app on PORT: ' + port);
});

module.exports = app;