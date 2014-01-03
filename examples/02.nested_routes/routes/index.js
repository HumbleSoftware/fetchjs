var
  _ = require('underscore'),
  resources = [
    {id : 1, name : 'foo'},
    {id : 2, name : 'bar'}
  ];

module.exports = function (app) {
  app.get('/resources', function (req, res) {
    res.json(resources);
  });
  app.get('/resources/:id', function (req, res) {
    var
      resource = _.find(resources, function (resource) {
        return resource.id == req.params.id;
      });
    if (resource) {
      res.json(resource);
    } else {
      res.send(404);
    }
  });
};
