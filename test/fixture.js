'use strict';

var idCounter = 0;

function fixture(type, config) {

  var basic = {
    type: type,
    label: type + '-label',
    appKey: 'appKey-' + idCounter,
    id: 'id-' + idCounter
  };

  idCounter ++;

  return Object.assign({}, basic, config);
}

module.exports = fixture;
