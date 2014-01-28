var path = require('path');
var browserify = require('browserify');
var _ = require('underscore');

/**
 * Options:
 *
 * server - path to the server routes
 * mocks - path to the mocks
 */
module.exports = function (options) {

  // Default options:
  options = _.defaults(options || {}, {
    mocks : 'mocks',
    routes : 'routes'
  });
  options.routes = path.resolve(process.cwd(), options.routes);
  options.mocks = path.resolve(process.cwd(), options.mocks);

  // Build:
  var b = browserify(__dirname + '/client/server');

  // Require the mock API routes:
  b.require(options.routes, {
    expose : 'fetch-routes'
  });

  // Check for mock data:
  try {
    require.resolve(options.mocks);
    b.require(options.mocks, {
      expose : 'fetch-mocks'
    });
  } catch (e) {
    b.require(__dirname + '/client/mocks_error', {
      expose : 'fetch-mocks'
    });
    console.log('Cannot find mocks at \'' + options.mocks + '\'');
  }

  // Return bundler function:
  return function bundle (options, callback) {
    return b.bundle(_.defaults(options || {}, {
      standalone : 'fetch'
    }), callback);
  }

};

