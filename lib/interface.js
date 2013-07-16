var
  Suite = require('mocha/lib/suite'),
  Test = require('mocha/lib/test'),
  BDD = require('mocha/lib/interfaces/bdd'),
  superagent = require('superagent'),
  _ = require('underscore'),
  METHODS = {
    'get': {
      display: 'GET'
    },
    'head': {
      display: 'HEAD'
    },
    'del': {
      display: 'DELETE'
    },
    'patch': {
      display: 'PATCH'
    },
    'post': {
      display: 'POST'
    },
    'put': {
      display: 'PUT'
    }
  };

module.exports = function factory (config) {

  var
    baseUrl = config.base;

  function fetchInterface (suite) {

    var
      suites = [suite];

    /**
     * Allow default BDD interface:
     *
     * We may want to remove this entirely, leaving just our API.
     */

    BDD(suite);

    /**
     * Register fetch.js interface with mocha:
     */

    suite.on('pre-require', function (context, file, mocha) {

      /**
       * Suite entry point mirroring the superagent API
       */

      context.test = _.reduce(METHODS, function (test, config, method) {
        test[method] = _.partial(setupSuite, method);
        return test;
      }, {});

      /**
       * Custom implementation of only
       */
      var
        only = _.reduce(METHODS, function (only, config, method) {
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
      }



      /**
       * Describe a test-case with title and callback.  
       *
       * Callback takes error and response from request.
       */

      context.it = function (name, callback) {
        var
          suite = suites[0],
          fn = suite.pending ? null : function () {
            if (callback) {
              // Invoke function, checking arity
              if (callback.length === 1) {
                callback(suite.res);
              } else {
                callback(suite.error, suite.res);
              }
            }
          },
          test = new Test(name, fn);
        suite.addTest(test);
        return test;
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

    });

    /**
     * Helpers:
     */

    function setupSuite (method, url, data, fn) {
      var 
        request = superagent[method](baseUrl + url),
        name = METHODS[method].display + ' ' + url,
        suite = Suite.create(suites[0], name),
        handlers = [];


      suite.request = request;


      // Wait for request before running suite
      suite.beforeAll(function (done) {
        request.end(function (error, res) {
          suite.error = error;
          suite.res = res;
          done()
        });
      });


      // Attach test cases:
      if (_.isFunction(data)) {
        fn = data;
        data = null;
      }
      if (_.isFunction(fn)) insert(fn);


      // Attach data (post, put, etc):
      if (data) request.send(data);


      // Insert tests into the suite
      function insert (fn) {
        suites.unshift(suite);
        fn.call(suite, suite.parent.res);
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
  }

  return fetchInterface;
};

