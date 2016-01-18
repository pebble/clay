'use strict';

var configPageHtml = require('./tmp/config-page.html');
//var errorPageHtml = require('./tmp/error-page.html');

function encodeDataUri(input) {
  if (window.btoa) {
    return 'data:text/html;base64,' + encodeURIComponent(window.btoa(input));
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

  return 'data:text/html;base64,' + encodeURIComponent(out.join(''));
}

/**
 * @param {array} config - the Clay config
 * @param {function} [customFn] - custom code to run from the config page.
 * Will run with api as context
 * @constructor
 */
function Clay(config, customFn) {
  this.config = config;
  this.customFn = customFn || function() {};
}

/**
 * Generate the Data URI used by the config Page with settings injected
 * @param {string} returnTo - used while developing on desktop.
 */
Clay.prototype.generateUrl = function(returnTo) {
  var settings;
  try {
    settings = JSON.parse(localStorage.getItem('clay-settings')) || {};
  } catch (e) {
    console.error(e);
    settings = {};
  }

  var strings = {
    customFn: this.customFn.toString().replace(/^.*?\{/, '{'),
    returnTo: returnTo || 'pebblejs://close#',
    config: JSON.stringify(this.config),
    settings: JSON.stringify(settings)
  };

  // Show config page
  return encodeDataUri(configPageHtml
    .replace('$$CUSTOM_FN$$', strings.customFn)
    .replace('$$RETURN_TO$$', strings.returnTo)
    .replace('$$CONFIG$$', strings.config)
    .replace('$$SETTINGS$$', strings.settings)
  );
};

Clay.prototype.getSettings = function(response) {
  // Decode and parse config data as JSON
  var settings = JSON.parse(decodeURIComponent(response));
  // @todo get defaults in here
  if (!settings) return {};

  localStorage.setItem('clay-settings', JSON.stringify(settings));
  return settings;
};

module.exports = Clay;
