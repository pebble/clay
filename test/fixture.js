'use strict';

var _ = require('../src/scripts/vendor/minified/minified')._;
var ClayItem = require('../src/scripts/lib/clay-item');
var idCounter = 0;

/**
 * @param {string} type
 * @param {{}} [config]
 * @returns {{}}
 */
function configItem(type, config) {

  var basic = {
    type: type,
    label: type + '-label',
    appKey: 'appKey-' + idCounter,
    id: 'id-' + idCounter
  };

  idCounter++;

  return _.extend({}, basic, config);
}

/**
 *
 * @param {string} type
 * @param {{}} [config]
 * @returns {ClayItem}
 */
function clayItem(type, config) {
  return new ClayItem(configItem(type, config));
}

module.exports.configItem = configItem;
module.exports.clayItem = clayItem;
