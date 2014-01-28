var
  _ = require('underscore'),
  watch = require('node-watch'),
  forever = require('forever-monitor'),
  build = require('../lib/build');

module.exports = function (options) {
  build(options);
};
