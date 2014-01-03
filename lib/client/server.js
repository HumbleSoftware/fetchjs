var GhostTrain = require('ghosttrain');
var fetchAPI = require('fetch-api');

module.exports = function (options) {
  var app = new GhostTrain();
  fetchAPI(app);
  var fetch = function () {
    app.request.apply(app, arguments);
  };
  fetch.app = app;
  return fetch;
};
