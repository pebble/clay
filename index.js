'use strict';

var configPageHtml = require('./tmp/config-page.html');
var toSource = require('tosource');
var standardComponents = require('./src/scripts/components');

/**
 * @param {Array} config - the Clay config
 * @param {function} [customFn] - Custom code to run from the config page. Will run
 *   with the ClayConfig instance as context
 * @param {Object} [options] - Additional options to pass to Clay
 * @param {boolean} [options.autoHandleEvents] - If false, Clay will not
 *   automatically handle the 'showConfiguration' and 'webviewclosed' events
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

  self.config = config;
  self.customFn = customFn || function() {};
  self.components = {};
  self.meta = {
    activeWatchInfo: null,
    accountToken: '',
    watchToken: ''
  };

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
   * Populate the meta with data from the Pebble object. Make sure to run this inside
   * either the "showConfiguration" or "ready" event handler
   * @return {void}
   */
  function _populateMeta() {
    self.meta = {
      activeWatchInfo: Pebble.getActiveWatchInfo && Pebble.getActiveWatchInfo(),
      accountToken: Pebble.getAccountToken(),
      watchToken: Pebble.getWatchToken()
    };
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
 * @returns {Object}
 */
Clay.prototype.getSettings = function(response) {
  // Decode and parse config data as JSON
  var settings = {};

  try {
    settings = JSON.parse(decodeURIComponent(response));
  } catch (e) {
    throw new Error('The provided response was not valid JSON');
  }

  localStorage.setItem('clay-settings', JSON.stringify(settings));
  return settings;
};

/**
 * @param {string} input
 * @param {string} [prefix]
 * @returns {string}
 */
Clay.encodeDataUri = function(input, prefix) {
  prefix = typeof prefix !== 'undefined' ? prefix : 'data:text/html;base64,';

  if (window.btoa) {
    return prefix + encodeURIComponent(window.btoa(input));
  }

  // iOS doesn't have a window so we need to polyfil window.btoa
  // extracted from https://github.com/inexorabletash/polyfill
  var B64_ALPHABET =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  input = String(input);
  var position = 0;
  var out = [];
  var o1;
  var o2;
  var o3;
  var e1;
  var e2;
  var e3;
  var e4;

  if (/[^\x00-\xFF]/.test(input)) { throw Error('InvalidCharacterError'); }

  while (position < input.length) {
    o1 = input.charCodeAt(position++);
    o2 = input.charCodeAt(position++);
    o3 = input.charCodeAt(position++);

    // 111111 112222 222233 333333
    e1 = o1 >> 2;
    e2 = ((o1 & 0x3) << 4) | (o2 >> 4);
    e3 = ((o2 & 0xf) << 2) | (o3 >> 6);
    e4 = o3 & 0x3f;

    if (position === input.length + 2) {
      e3 = 64;
      e4 = 64;
    } else if (position === input.length + 1) {
      e4 = 64;
    }

    out.push(B64_ALPHABET.charAt(e1),
      B64_ALPHABET.charAt(e2),
      B64_ALPHABET.charAt(e3),
      B64_ALPHABET.charAt(e4));
  }

  return prefix + encodeURIComponent(out.join(''));
};

module.exports = Clay;
