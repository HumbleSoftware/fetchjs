var
  _ = require('underscore');

module.exports = function (options) {
  var
    express = require('express'),
    app = express();
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());

  // verbose middleware:
  app.use(function (req, res, next) {
    console.log(' ' + req.method + '\t' + req.url);
    next();
  });

  // latency middleware
  app.use(function (req, res, next) {
    _.delay(next, options.latency);
  });

  require(options.path)(app);

  app.listen(options.port);
  console.log('server started on port ' + options.port);

  return app;
};
