/**
 * Mock data helper API.
 *
 * Questions:
 *
 *  Do we want to build on an existing API like underscore?
 *  Do we want a declarative DSL for specifying data?
 *  Do we want to generate sample data?
 *  Do we want to support more than JSON?
 *  How can we make it possible to extend the API arbitrarily?
 *  At which state should we include JSON fixations?
 */


var
  util = require('./util'),
  _ = require('underscore');

module.exports = function (options) {

  var
    clean = util.clean,
    mocks = {};

  // Fill JSON
  _.each(options.data, function (data, type) {
    var 
      fn = mocks[type] = function () {
        return clean(data);
      };  

    fn.byId = function (id) {
      var item = _.find(data, function (item) {
        return item.id == id; 
      });
      return item ? clean(item) : item;
    };  
    fn.byKey = function (key) {
      item = _.find(data, function (item) {
        return item['__fetch-key'] == key; 
      });
      return item ? clean(item) : item;
    };  

    fn.new = function () {
      var 
        item = _.find(data, function (item) {
          return item['__fetch-key'] === 'default';
        }); 

      if (!item) {
        item = _.first(data);
      }   

      item = clean(item);

      delete item.id;

      return item;
    };  
    fn.add = function (item) {
      item.id = newId();
      data.push(item);
      return item;
    };
    fn.update = function (item) {
      return _.extend(_.findWhere(data, { id : item.id }), clean(item));
    };
    fn.remove = function (item) {
      var item = _.findWhere(data, { id : item.id || item });
      var index = _.indexOf(data, item);
      if (index !== -1) {
        data.splice(index, 1);
      }
      return item;
    };

    function newId () {
      return _.max(data, function (item) {
        return item.id;
      }).id + 1;
    }
  });

  return mocks;
};

