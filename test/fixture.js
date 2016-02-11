'use strict';

var _ = require('../src/scripts/vendor/minified')._;
var $ = require('../src/scripts/vendor/minified').$;
var HTML = require('../src/scripts/vendor/minified').HTML;
var ClayItem = require('../src/scripts/lib/clay-item');
var ClayConfig = require('../src/scripts/lib/clay-config');
var components = require('../src/scripts/components');
var componentRegistry = require('../src/scripts/lib/component-registry');
var idCounter = 0;

/**
 * @param {string|{}} config
 * @param {boolean} [autoRegister=true]
 * @returns {Clay~ConfigItem}
 */
module.exports.configItem = function(config, autoRegister) {
  if (typeof config === 'string') {
    config = { type: config };
  }

  var result = _.extend({}, {
    label: config.type + '-label',
    appKey: 'appKey-' + idCounter,
    id: 'id-' + idCounter
  }, config);

  idCounter++;

  if (autoRegister !== false &&
      !componentRegistry[result.type] &&
      result.type !== 'section') {
    ClayConfig.registerComponent(components[result.type]);
  }

  return result;
};

/**
 * @param {string|{}} config
 * @param {boolean} [autoRegister=true]
 * @returns {ClayItem}
 */
module.exports.clayItem = function(config, autoRegister) {
  return new ClayItem(module.exports.configItem(config, autoRegister));
};

/**
 * @param {[]} types
 * @param {boolean} [autoRegister=true]
 * @returns {*}
 */
module.exports.config = function(types, autoRegister) {
  return types.map(function(item) {
    return Array.isArray(item) ?
      {type: 'section', items: module.exports.config(item, autoRegister)} :
      module.exports.configItem(item, autoRegister);
  });
};

/**
 * @param {[]} types
 * @param {boolean} [build=true] - run the build method on the result
 * @param {boolean} [autoRegister=true]
 * @param {{}} [settings] - settings to pass to constructor
 * @returns {ClayConfig}
 */
module.exports.clayConfig = function(types, build, autoRegister, settings) {
  var clayConfig = new ClayConfig(
    settings || {},
    module.exports.config(types, autoRegister),
    $(HTML('<div>'))
  );
  return build === false ? clayConfig : clayConfig.build();
};

