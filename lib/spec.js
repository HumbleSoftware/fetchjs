/**
 * Spec Runner
 */

var
  Mocha = require('mocha'),
  chai = require('chai'),
  chaiHttp = require('chai-http'),
  superagent = require('superagent'),
  _ = require('underscore'),
  methods = [
    'get',
    'head',
    'del',
    'patch',
    'post',
    'put'
  ];

module.exports = function (options) {

  var
    base = options.base;

  // shared globals:
  // TODO sort this out for the browser
  global.chai = chai;
  global.expect = chai.expect;
  global.request = request;

  // setup chai
  chai.use(chaiHttp);

  runMocha(options)



  // Run Mocha
  function runMocha (options) {
    var
      mocha = new Mocha({
        ui : 'bdd',
        reporter : options.reporter,
      });
    if (options.grep) {
      mocha.grep(new RegExp(options.grep));
    }
    mocha.addFile(options.path);
    mocha.run(function (failures) {
      process.exit(failures);
    });
  }


  // Request wrapper
  function request (method, url) {
    return new Request
    // callback
    if ('function' == typeof url) {
      return superagent.request(base + method, url);
    }
    // url first
    if (1 == arguments.length) {
      return superagent.request(base + method, url);
    }
    return superagent.request(method, base + url);
  }
  _.each(methods, function (method) {
    request[method] = function (url) {
      var
        args = Array.prototype.slice.call(arguments, 0);
      args[0] = base + url;
      return superagent[method].apply(superagent.request, args);
    };
  });
};

