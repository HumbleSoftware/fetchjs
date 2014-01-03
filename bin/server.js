var
  _ = require('underscore'),
  watch = require('node-watch'),
  forever = require('forever-monitor'),
  server = require('../lib/server');

module.exports = function (path, program) {

  if (!program) {
    program = path;
    path = 'routes';
  }
  path = process.cwd() + '/' + path;

  var
    options = {
      port : program.port,
      latency : program.latency,
      path : path
    };

  if (program.watch) {

    // Recurse without watch:

    var
      args = _.without(process.argv, '-w', '--watch'),
      child;

    start();
    watch(
      path,
      {
        followSymLinks : true
      },
      _.debounce(function () {
        if (child) child.stop();
        start();
      }, 10)
    );
    function start () {
      child = forever.start(args, {});
      process.stdin.pipe(child.child.stdio[0]);
    }
  } else {
    // If not watching start the server
    server(options);
  }

};
