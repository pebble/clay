'use strict';

var configPageHtml = require('./tmp/config-page.html');
var toSource = require('tosource');
var standardComponents = require('./src/scripts/components');
var utils = require('./src/scripts/lib/utils');
var deepcopy = require('deepcopy/build/deepcopy.min');

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

  try {
    settings = JSON.parse(decodeURIComponent(response));
  } catch (e) {
    throw new Error('The provided response was not valid JSON');
  }

  localStorage.setItem('clay-settings', JSON.stringify(settings));

  return convert === false ? settings : utils.prepareSettingsForAppMessage(settings);
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

module.exports = Clay;
