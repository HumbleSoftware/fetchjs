var
  fs = require('fs'),
  bundle = require('./bundle');

module.exports = function (options) {
  var file = fs.createWriteStream(options.output);
  var output = bundle(options);
  output().pipe(file);
};

