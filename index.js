'use strict';

var configPageHtml = require('./tmp/config-page.html');
var toSource = require('tosource');
var standardComponents = require('./src/scripts/components');
var deepcopy = require('deepcopy/build/deepcopy.min');
var version = require('./package.json').version;
var messageKeys = require('message_keys');

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
   * If this function returns true then the callback will be executed
   * @callback _scanConfig_testFn
   * @param {Clay~ConfigItem} item
   */

  /**
   * @callback _scanConfig_callback
   * @param {Clay~ConfigItem} item
   */

  /**
   * Scan over the config and run the callback if the testFn resolves to true
   * @private
   * @param {Clay~ConfigItem|Array} item
   * @param {_scanConfig_testFn} testFn
   * @param {_scanConfig_callback} callback
   * @return {void}
   */
  function _scanConfig(item, testFn, callback) {
    if (Array.isArray(item)) {
      item.forEach(function(item) {
        _scanConfig(item, testFn, callback);
      });
    } else if (item.type === 'section') {
      _scanConfig(item.items, testFn, callback);
    } else if (testFn(item)) {
      callback(item);
    }
  }

  // register standard components
  _scanConfig(self.config, function(item) {
    return standardComponents[item.type];
  }, function(item) {
    self.registerComponent(standardComponents[item.type]);
  });

  // validate config against teh use of appKeys
  _scanConfig(self.config, function(item) {
    return item.appKey;
  }, function() {
    throw new Error('appKeys are no longer supported. ' +
                    'Please follow the migration guide to upgrade your project');
  });
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
 * Updates the settings with the given value(s).
 *
 * @signature `clay.setSettings(key, value)`
 * @param {String} key - The property to set.
 * @param {*} value - the value assigned to _key_.
 * @return {undefined}
 *
 * @signature `clay.setSettings(settings)`
 * @param {Object} settings - an object containing the key/value pairs to be set.
 * @return {undefined}
 */
Clay.prototype.setSettings = function(key, value) {
  var settingsStorage = {};

  try {
    settingsStorage = JSON.parse(localStorage.getItem('clay-settings')) || {};
  } catch (e) {
    console.error(e.toString());
  }

  if (typeof key === 'object') {
    var settings = key;
    Object.keys(settings).forEach(function(key) {
      settingsStorage[key] = settings[key];
    });
  } else {
    settingsStorage[key] = value;
  }

  localStorage.setItem('clay-settings', JSON.stringify(settingsStorage));
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
 *  - Arrays that contain strings will be returned without modification
 *    eg: ['one', 'two'] becomes ['one', 'two']
 *  - Arrays that contain numbers will be returned without modification
 *    eg: [1, 2] becomes [1, 2]
 *  - Arrays that contain booleans will be converted to a 0 or 1
 *    eg: [true, false] becomes [1, 0]
 *  - Arrays must be single dimensional
 *  - Objects that have a "value" property will apply the above rules to the type of
 *    value. If the value is a number or an array of numbers and the optional
 *    property: "precision" is provided, then the number will be multiplied by 10 to
 *    the power of precision (value * 10 ^ precision) and then floored.
 *    Eg: 1.4567 with a precision set to 3 will become 1456
 * @param {number|string|boolean|Array|Object} val
 * @param {number|string|boolean|Array} val.value
 * @param {number|undefined} [val.precision=0]
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
    val.forEach(function(item, index) {
      result[index] = Clay.prepareForAppMessage(item);
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
 * Pebble.sendAppMessage(); It also uses the provided messageKeys to correctly
 * assign arrays into individual keys
 * @see {prepareForAppMessage}
 * @param {Object} settings
 * @returns {{}}
 */
Clay.prepareSettingsForAppMessage = function(settings) {

  // flatten settings
  var flatSettings = {};
  Object.keys(settings).forEach(function(key) {
    var val = settings[key];
    var matches = key.match(/(.+?)(?:\[(\d*)\])?$/);

    if (!matches[2]) {
      flatSettings[key] = val;
      return;
    }

    var position = parseInt(matches[2], 10);
    key = matches[1];

    if (typeof flatSettings[key] === 'undefined') {
      flatSettings[key] = [];
    }

    flatSettings[key][position] = val;
  });

  var result = {};
  Object.keys(flatSettings).forEach(function(key) {
    var messageKey = messageKeys[key];
    var settingArr = Clay.prepareForAppMessage(flatSettings[key]);
    settingArr = Array.isArray(settingArr) ? settingArr : [settingArr];

    settingArr.forEach(function(setting, index) {
      result[messageKey + index] = setting;
    });
  });

  // validate the settings
  Object.keys(result).forEach(function(key) {
    if (Array.isArray(result[key])) {
      throw new Error('Clay does not support 2 dimensional arrays for item ' +
                      'values. Make sure you are not attempting to use array ' +
                      'syntax (eg: "myMessageKey[2]") in the messageKey for ' +
                      'components that return an array, such as a checkboxgroup');
    }
  });

  return result;
};

module.exports = Clay;
