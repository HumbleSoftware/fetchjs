var
  readline = require('readline'),
  _ = require('underscore');

module.exports = function (options) {
  var
    express = require('express'),
    app = express();

  // Set up server:
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());

  // verbose middleware:
  app.use(function (req, res, next) {
    log(' << ' + req.method + '\t' + req.url);
    next();
  });

  // latency middleware:
  app.use(function (req, res, next) {
    _.delay(next, options.latency);
  });

  // Interceptor middleware:
  var intercepts = [];
  app.use(function (req, res, next) {
    var
      method = req.method,
      url = req.url,
      intercept;

    intercept = _.find(intercepts, function (intercept, i) {
      intercept = intercept.split(/\s+/);
      if (
        intercept[0] === method &&
        intercept[1] === url
      ) {
        // remove the intercept
        intercepts.splice(i, 1);
        log(' >> ' + intercept[2]);
        res.send(parseInt(intercept[2], 10));
        return true;
      }
    });

    if (!intercept) next();
  });
  rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout
  });
  /*
  // charm = require('charm')(process);
  charm = require('charm')();
  charm.pipe(process.stdout);
  */
  rl.setPrompt('$ ');
  rl.prompt();
  rl.on('line', function (cmd) {
    rl.prompt();
    // charm.erase('start');
    intercepts.push(cmd);
  });
  function log (s) {
    // charm.erase('start');
    // charm.move(-500, 0);
    process.stdout.write(s + '\n');
    rl.prompt();
  }

  // Start the server:
  require(options.path)(app);
  app.listen(options.port, function () {
    console.log('listening on port ' + options.port);
  });
};
