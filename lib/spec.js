/**
 * Spec Runner
 */

var
  Mocha = require('mocha'),
  chai = require('chai'),
  chaiHttp = require('chai-http');

module.exports = function (options) {

  var base = options.base;

  // Force colors for now:
  //
  // We'll want to decide this based on where the output is
  // going (don't want color codes in a file).
  Mocha.reporters.Base.useColors = true;

  // shared globals:
  // TODO sort this out for the browser
  global.chai = chai;
  global.expect = chai.expect;

  // setup chai
  chai.use(chaiHttp);

  runMocha(options)



  // Run Mocha
  function runMocha (options) {

    Mocha.interfaces.fetch = require('./interface')(options);

    var mocha = new Mocha({
      ui : 'fetch',
      reporter : options.reporter
    });

    if (options.grep) {
      mocha.grep(new RegExp(options.grep));
    }

    mocha.addFile(options.path);
    mocha.run(function (failures) {
      process.exit(failures);
    });
  }

};

