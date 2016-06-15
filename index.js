'use strict';

var configPageHtml = require('./tmp/config-page.html');
var toSource = require('tosource');
var standardComponents = require('./src/scripts/components');
var deepcopy = require('deepcopy/build/deepcopy.min');
var version = require('./package.json').version;

/**
 * @param {Array} config - the Clay config
 * @param {function} [customFn] - Custom code to run from the config page. Will run
 *   with the ClayConfig instance as context
 * @param {Object} [options] - Additional options to pass to Clay
 * @param {boolean} [options.autoHandleEvents=true] - If false, Clay will not
 *   automatically handle the 'showConfiguration' and 'webviewclosed' events
 * @param {*} [options.userData={}] - Arbitrary data to pass to the config page. Will
 *   be available as `clayConfig.meta.userData`
 * @constructor
 */
function Clay(config, customFn, options) {
  var self = this;

  if (!Array.isArray(config)) {
    throw new Error('config must be an Array');
  }

  if (customFn && typeof customFn !== 'function') {
    throw new Error('customFn must be a function or "null"');
  }

  options = options || {};

  self.config = deepcopy(config);
  self.customFn = customFn || function() {};
  self.components = {};
  self.meta = {
    activeWatchInfo: null,
    accountToken: '',
    watchToken: '',
    userData: {}
  };
  self.version = version;

  /**
   * Populate the meta with data from the Pebble object. Make sure to run this inside
   * either the "showConfiguration" or "ready" event handler
   * @return {void}
   */
  function _populateMeta() {
    self.meta = {
      activeWatchInfo: Pebble.getActiveWatchInfo && Pebble.getActiveWatchInfo(),
      accountToken: Pebble.getAccountToken(),
      watchToken: Pebble.getWatchToken(),
      userData: deepcopy(options.userData || {})
    };
  }

  // Let Clay handle all the magic
  if (options.autoHandleEvents !== false && typeof Pebble !== 'undefined') {

    Pebble.addEventListener('showConfiguration', function() {
      _populateMeta();
      Pebble.openURL(self.generateUrl());
    });

    Pebble.addEventListener('webviewclosed', function(e) {

      if (!e || !e.response) { return; }

      // Send settings to Pebble watchapp
      Pebble.sendAppMessage(self.getSettings(e.response), function() {
        console.log('Sent config data to Pebble');
      }, function(error) {
        console.log('Failed to send config data!');
        console.log(JSON.stringify(error));
      });
    });
  } else if (typeof Pebble !== 'undefined') {
    Pebble.addEventListener('ready', function() {
      _populateMeta();
    });
  }

  /**
   * @private
   * @param {Clay~ConfigItem|Array} item
   * @return {void}
   */
  function _registerStandardComponents(item) {
    if (Array.isArray(item)) {
      item.forEach(function(item) {
        _registerStandardComponents(item);
      });
    } else if (item.type === 'section') {
      _registerStandardComponents(item.items);
    } else if (standardComponents[item.type]) {
      self.registerComponent(standardComponents[item.type]);
    }
  }

  _registerStandardComponents(self.config);
}

/**
 * Register a component to Clay.
 * @param {Object} component - the clay component to register
 * @param {string} component.name - the name of the component
 * @param {string} component.template - HTML template to use for the component
 * @param {string|Object} component.manipulator - methods to attach to the component
 * @param {function} component.manipulator.set - set manipulator method
 * @param {function} component.manipulator.get - get manipulator method
 * @param {Object} [component.defaults] - template defaults
 * @param {function} [component.initialize] - method to scaffold the component
 * @return {boolean} - Returns true if component was registered correctly
 */
Clay.prototype.registerComponent = function(component) {
  this.components[component.name] = component;
};

/**
 * Generate the Data URI used by the config Page with settings injected
 * @return {string}
 */
Clay.prototype.generateUrl = function() {
  var settings = {};
  var emulator = !Pebble || Pebble.platform === 'pypkjs';
  var returnTo = emulator ? '$$$RETURN_TO$$$' : 'pebblejs://close#';

  try {
    settings = JSON.parse(localStorage.getItem('clay-settings')) || {};
  } catch (e) {
    console.error(e.toString());
  }

  var compiledHtml = configPageHtml
    .replace('$$RETURN_TO$$', returnTo)
    .replace('$$CUSTOM_FN$$', toSource(this.customFn))
    .replace('$$CONFIG$$', toSource(this.config))
    .replace('$$SETTINGS$$', toSource(settings))
    .replace('$$COMPONENTS$$', toSource(this.components))
    .replace('$$META$$', toSource(this.meta));

  // if we are in the emulator then we need to proxy the data via a webpage to
  // obtain the return_to.
  // @todo calculate this from the Pebble object or something
  if (emulator) {
    return Clay.encodeDataUri(
      compiledHtml,
      'http://clay.pebble.com.s3-website-us-west-2.amazonaws.com/#'
    );
  }

  return Clay.encodeDataUri(compiledHtml);
};

/**
 * Parse the response from the webviewclosed event data
 * @param {string} response
 * @param {boolean} [convert=true]
 * @returns {Object}
 */
Clay.prototype.getSettings = function(response, convert) {
  // Decode and parse config data as JSON
  var settings = {};
  response = response.match(/^\{/) ? response : decodeURIComponent(response);

  try {
    settings = JSON.parse(response);
  } catch (e) {
    throw new Error('The provided response was not valid JSON');
  }

  // flatten the settings for localStorage
  var settingsStorage = {};
  Object.keys(settings).forEach(function(key) {
    if (typeof settings[key] === 'object' && settings[key]) {
      settingsStorage[key] = settings[key].value;
    } else {
      settingsStorage[key] = settings[key];
    }
  });

  localStorage.setItem('clay-settings', JSON.stringify(settingsStorage));

  return convert === false ? settings : Clay.prepareSettingsForAppMessage(settings);
};

/**
 * @param {string} input
 * @param {string} [prefix='data:text/html;charset=utf-8,']
 * @returns {string}
 */
Clay.encodeDataUri = function(input, prefix) {
  prefix = typeof prefix !== 'undefined' ? prefix : 'data:text/html;charset=utf-8,';
  return prefix + encodeURIComponent(input);
};

/**
 * Converts the val into a type compatible with Pebble.sendAppMessage().
 *  - Strings will be returned without modification
 *  - Numbers will be returned without modification
 *  - Booleans will be converted to a 0 or 1
 *  - Arrays that contain strings will be split with a zero.
 *    eg: ['one', 'two'] becomes ['one', 0, 'two', 0]
 *  - Arrays that contain numbers will be returned without modification
 *    eg: [1, 2] becomes [1, 2]
 *  - Arrays that contain booleans will be converted to a 0 or 1
 *    eg: [true, false] becomes [1, 0]
 *  - Arrays must be single dimensional
 *  - Objects that have a "value" property will apply the above rules to the type of
 *    value. If the value is a number or an array of numbers and the optional
 *    property: "precision" is provided, then the number will be multipled by 10 to
 *    the power of precision (value * 10 ^ precision) and then floored.
 *    Eg: 1.4567 with a precision set to 3 will become 1456
 * @param {number|string|boolean|Array|Object} val
 * @param {number|string|boolean|Array} val.value
 * @param {number} [val.precision=0]
 * @returns {number|string|Array}
 */
Clay.prepareForAppMessage = function(val) {

  /**
   * moves the decimal place of a number by precision then drop any remaining decimal
   * places.
   * @param {number} number
   * @param {number} precision - number of decimal places to move
   * @returns {number}
   * @private
   */
  function _normalizeToPrecision(number, precision) {
    return Math.floor(number * Math.pow(10, precision || 0));
  }

  var result;

  if (Array.isArray(val)) {
    result = [];
    val.forEach(function(item) {
      var itemConverted = Clay.prepareForAppMessage(item);
      result.push(itemConverted);
      if (typeof itemConverted === 'string') {
        result.push(0);
      }
    });
  } else if (typeof val === 'object' && val) {
    if (typeof val.value === 'number') {
      result = _normalizeToPrecision(val.value, val.precision);
    } else if (Array.isArray(val.value)) {
      result = val.value.map(function(item) {
        if (typeof item === 'number') {
          return _normalizeToPrecision(item, val.precision);
        }
        return item;
      });
    } else {
      result = Clay.prepareForAppMessage(val.value);
    }
  } else if (typeof val === 'boolean') {
    result = val ? 1 : 0;
  } else {
    result = val;
  }

  return result;
};

/**
 * Converts a Clay settings dict into one that is compatible with
 * Pebble.sendAppMessage();
 * @see {prepareForAppMessage}
 * @param {Object} settings
 * @returns {{}}
 */
Clay.prepareSettingsForAppMessage = function(settings) {
  var result = {};
  Object.keys(settings).forEach(function(key) {
    result[key] = Clay.prepareForAppMessage(settings[key]);
  });
  return result;
};

module.exports = Clay;
