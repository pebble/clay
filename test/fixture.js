'use strict';

var _ = require('../src/scripts/vendor/minified/minified')._;
var idCounter = 0;

function fixture(type, config) {

  var basic = {
    type: type,
    label: type + '-label',
    appKey: 'appKey-' + idCounter,
    id: 'id-' + idCounter
  };

  idCounter++;

  return _.extend({}, basic, config);
}

module.exports = fixture;
