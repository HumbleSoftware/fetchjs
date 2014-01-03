var
  _ = require('underscore'),
  watch = require('node-watch'),
  forever = require('forever-monitor'),
  spawn = require('child_process').spawn,
  spec = require('../lib/spec');

module.exports = function (url, program) {

  if (/^http(s){0,1}:\/\//i.test(url)) {
    url = url;
  } else {
    files = url;
  }

  var
    options = {
      base : url || 'http://localhost:3000',
      reporter : program.reporter,
      path : process.cwd() + '/' + (program.spec || 'spec'),
      grep : program.grep
    };

  if (program.watch) {

    var
      args = _.without(process.argv, '-w', '--watch'),
      program = args.shift(),
      child;

    start();
    watch(
      options.path,
      {
        followSymLinks : true
      },
      _.debounce(function () {
        if (child) child.kill();
        start();
      }, 10)
    );
    function start () {
      child = spawn(program, args);
      process.stdin.pipe(child.stdio[0]);
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
    }
  } else {
    // Not watching execute command
    spec(options);
  }

};
