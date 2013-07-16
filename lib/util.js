/**
 * FetchJS utilities
 */

var
  _ = require('underscore');

// Clone that data:
function clone (data) {
  return JSON.parse(JSON.stringify(data));
}

// Stripper removes fetch annotations
var
  stripSearch = /__fetch/;
function strip (data) {
  var 
    type = typeof data;
  if (type === 'object' || type === 'array') {
    _.each(data, function (item, key) {
      if (stripSearch.test(key)) {
        delete data[key];
      }   
      strip(item);
    }); 
  }
  return data;
}

// Dereference and strip:
function clean (data) {
  return strip(clone(data));
}

module.exports = {
  clean : clean,
  clone : clone,
  strip : strip
};

