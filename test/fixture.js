'use strict';

var _ = require('../src/scripts/vendor/minified/minified')._;
var $ = require('../src/scripts/vendor/minified/minified').$;
var HTML = require('../src/scripts/vendor/minified/minified').HTML;
var ClayItem = require('../src/scripts/lib/clay-item');
var ClayConfig = require('../src/scripts/lib/clay-config');
var idCounter = 0;

var componentRegistry = require('../src/scripts/lib/component-registry');

// add some components to the registry to test
ClayConfig.registerComponent(require('pebble-clay-components/dist/components/text'));
ClayConfig.registerComponent(require('pebble-clay-components/dist/components/input'));
ClayConfig.registerComponent(require('pebble-clay-components/dist/components/toggle'));
ClayConfig.registerComponent(require('pebble-clay-components/dist/components/footer'));
ClayConfig.registerComponent(require('pebble-clay-components/dist/components/select'));

/**
 * @param {string|{}} config
 * @returns {{}}
 */
module.exports.configItem = function(config) {
  if (typeof config === 'string') {
    config = { type: config };
  }

  var basic = {
    label: config.type + '-label',
    appKey: 'appKey-' + idCounter,
    id: 'id-' + idCounter
  };

  idCounter++;

  return _.extend({}, basic, config);
};

/**
 * @param {string|{}} [config]
 * @returns {ClayItem}
 */
module.exports.clayItem = function(config) {
  return new ClayItem(module.exports.configItem(config));
};

/**
 * @param {[]} types
 * @returns {*}
 */
module.exports.config = function(types) {
  return types.map(function(item) {
    return Array.isArray(item) ?
      {type: 'section', items: module.exports.config(item)} :
      module.exports.configItem(item);
  });
};

/**
 * @param {[]} types
 * @param {boolean} [noBuild=false] - don't run the build method on the result
 * @param {{}} [settings] - settings to pass to constructor
 * @returns {ClayConfig}
 */
module.exports.clayConfig = function(types, noBuild, settings) {
  var clayConfig = new ClayConfig(
    settings || {},
    module.exports.config(types), $(HTML('<div>'))
  );
  return noBuild ? clayConfig : clayConfig.build();
};

