var GhostTrain = require('ghosttrain');
var fetchRoutes = require('fetch-routes');
var fetchMocks = require('fetch-mocks');

module.exports = function (options) {
  var app = new GhostTrain();
  fetchRoutes(app);
  var fetch = function () {
    app.request.apply(app, arguments);
  };
  fetch.app = app;
  fetch.mocks = fetchMocks;
  return fetch;
};
