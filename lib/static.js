var bundle = require('./bundle');

module.exports = function (app, options) {

  var output = bundle(options);

  // Static server:
  app.get('/', function (req, res) {
    output().pipe(res);
  });
};
