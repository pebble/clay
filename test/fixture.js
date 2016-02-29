'use strict';

var _ = require('../src/scripts/vendor/minified')._;
var $ = require('../src/scripts/vendor/minified').$;
var HTML = require('../src/scripts/vendor/minified').HTML;
var ClayItem = require('../src/scripts/lib/clay-item');
var ClayConfig = require('../src/scripts/lib/clay-config');
var Clay = require('../index');
var components = require('../src/scripts/components');
var componentRegistry = require('../src/scripts/lib/component-registry');
var idCounter = 0;

/**
 * @returns {{accountToken: string, watchToken: string, activeWatchInfo: {platform:
 *   string, model: string, language: string, firmware: {major: number, minor:
 *   number, patch: number, suffix: string}}}}
 */
module.exports.meta = function() {
  return {
    accountToken: '0123456789abcdef0123456789abcdef',
    watchToken: '0123456789abcdef0123456789abcdef',
    activeWatchInfo: {
      platform: 'chalk',
      model: 'qemu_platform_chalk',
      language: 'en_US',
      firmware: {
        major: 3,
        minor: 3,
        patch: 2,
        suffix: ''
      }
    }
  };
};

/**
 * @param {string|Object} config
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
 * @param {string|Object} config
 * @param {boolean} [autoRegister=true]
 * @returns {ClayItem}
 */
module.exports.clayItem = function(config, autoRegister) {
  return new ClayItem(module.exports.configItem(config, autoRegister));
};

/**
 * @param {Array} types
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
 * @param {Array} types
 * @param {boolean} [build=true] - run the build method on the result
 * @param {boolean} [autoRegister=true]
 * @param {Object} [settings] - settings to pass to constructor
 * @returns {ClayConfig}
 */
module.exports.clayConfig = function(types, build, autoRegister, settings) {
  var clayConfig = new ClayConfig(
    settings || {},
    module.exports.config(types, autoRegister),
    $(HTML('<div>')),
    module.exports.meta()
  );
  return build === false ? clayConfig : clayConfig.build();
};

/**
 * @param {Array} config - the Clay config
 * @param {function} [customFn] - Custom code to run from the config page. Will run
 *   with the ClayConfig instance as context
 * @param {Object} [options] - Additional options to pass to Clay
 * @param {boolean} [options.autoHandleEvents] - If false, Clay will not
 *   automatically handle the 'showConfiguration' and 'webviewclosed' events
 * @param {boolean} [destroyLocalStorage=true]
 * @return {Clay}
 */
module.exports.clay = function(config, customFn, options, destroyLocalStorage) {
  if (destroyLocalStorage !== false) {
    localStorage.removeItem('clay-settings');
  }
  return new Clay(config, customFn, options);
};
