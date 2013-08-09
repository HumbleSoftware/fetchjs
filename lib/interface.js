var
  Suite = require('mocha/lib/suite'),
  Test = require('mocha/lib/test'),
  BDD = require('mocha/lib/interfaces/bdd'),
  superagent = require('superagent'),
  _ = require('underscore'),
  METHODS = [
    'del',
    'get',
    'head',
    'patch',
    'post',
    'put'
  ];

module.exports = function factory (config) {

  var
    baseUrl = config.base,
    callback = config.callback;

  function fetchInterface (suite) {

    var suites = [suite];

    // Register fetch.js interface with mocha:
    suite.on('pre-require', function (context, file, mocha) {

      context.it = context.specify = function(title, fn){
        var suite = suites[0];
        if (suite.pending) var fn = null;
        var test = new Test(title, fn);
        suite.addTest(test);
        return test;
      };

      // Suite entry point mirroring the superagent API:
      context.test = _.reduce(METHODS, function (test, method) {
        test[method] = _.partial(makeRequest, method);
        return test;
      }, {});

      /*
      // Custom only:
      var only = _.reduce(METHODS, function (only, method) {
        only[method] = function () {
          var
            fetchRequest = context.test[method].apply(test, arguments);
          mocha.grep(fetchRequest.suite.fullTitle());
          return fetchRequest;
        }
        return only;
      }, {});
      context.test.only = function () {
        return only;
      };
      */


      // Register a fetch suite:
      //
      // TOOD: queuing, concurrent requests
      function makeRequest (method, url, data, fn) {

        var request = superagent[method](baseUrl + url);
        var name = method.toUpperCase() + ' ' + url;
        var suite = Suite.create(suites[0], name);
        var handlers = [];

        suites.unshift(suite);

        // Create a proxy test for the async request
        var proxy = new Test('does a thing', function () {});
        suite.addTest(proxy);

        /**  Test adding the BDD helpers:
        BDD(suite);
        suite.emit('pre-require', context, null, mocha);
        **/

        // Make the async request before all other requests:
        suite.beforeAll(function (done) {

          // Make an actual test to handle the request
          var test = new Test('requests ' + url, function (done) {
            request.end(function (error, res) {
              attachTestCases(error, res);
              done();
            });
          });

          // Configure the test as done in mocha Suite.addTest
          test.parent = suite;
          test.timeout(suite.timeout());
          test.slow(suite.slow());
          test.ctx = suite.ctx;

          // Overload proxy run to copy test attributes:
          proxy.run = function (fn) {
            _.extend(proxy, test);
            fn();
          };

          test.run(function (err) {
            done();
          });
        });
        
        suites.shift();

  //      attachTestCases(error, res);

        // Attach test cases:
        function attachTestCases (error, res) {
          if (_.isFunction(fn)) {
            insert(fn, error, res);
          } else
          if (_.isFunction(data)) {
            insert(data, error, res); 
          }
        }

        // Attach data (post, put, etc):
        if (data && !_.isFunction(data)) request.send(data);


        // Insert tests into the suite
        function insert (fn, error, res) {
          suites.unshift(suite);
          fn.call(suite, error, res);
          suites.shift();
        }


        // Some kinda custom request wrapper
        function FetchRequest () {}
        FetchRequest.prototype = request;
        var
          fetchRequest = new FetchRequest();
        fetchRequest.end = function (fn) {
          insert(fn);
          return this;
        };
        fetchRequest.send = function () {
          request.send.apply(request, arguments);
          return this;
        };
        fetchRequest.suite = suite;
        return fetchRequest;
      }

    });
  }

  return fetchInterface;
};




      /**
       * Defer some test registration:
       *
       * We want some way to allow some async tests to depend
       * on the responses of other async tests.  Eg. request
       * a list of items for one test.  In nested tests, check
       * that GET works on one of those items individually.
       * 
       * Maybe that's a bad way to do tests in general?
       *
       * Thoughts?
       */
      /*
      context.wait = function (fn) {
        var
          suite = suites[0];
        suite.request.end(function () {
          suites.unshift(suite);
          fn();
          suites.shift();
        });
      };
      */
