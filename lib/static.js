var browserify = require('browserify');
var express = require('express');

module.exports = function (options) {

  // Build:
  var b = browserify(__dirname + '/client/server');
  b.require(process.cwd() + '/routes', {
    expose : 'fetch-api'
  });
  function bundle () {
    return b.bundle({
      standalone : 'fetch'
    });
  }

  // Static server:
  var port = options.port;
  var app = express();
  app.get('/', function (req, res) {
    bundle().pipe(res);
  });
  app.listen(port, function (err) {
    console.log('listening on ' + port)
  });
};
