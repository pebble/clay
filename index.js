'use strict';

var configPageHtml = require('./dist/config-page.html');

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

function Clay(config) {
  this.config = config;
  /**
   * @type {{}}
   * @private
   */
  this._defaults = {};
}

/**
 * Generate the Data URI used by the config Page with settings injected
 * @param {string} clayData - the entire HTML page as a data URI
 */
Clay.prototype.generateUrl = function() {
  var settings;
  try {
    settings = JSON.parse(localStorage.getItem('clay-settings')) || {};
  } catch (e) {
    console.error(e);
    settings = {};
  }
  // Show config page
  return encodeDataUri(configPageHtml
    .replace('$$CONFIG$$', JSON.stringify(this.config))
    .replace('$$SETTINGS$$', JSON.stringify(settings))
  );
};

Clay.prototype.getSettings = function(response) {
  // Decode and parse config data as JSON
  var settings = JSON.parse(decodeURIComponent(response));
  // @todo get defaults in here
  if (!settings) return {};

  localStorage.setItem('clay-settings', JSON.stringify(settings));
};

Clay.prototype.getDefaults = function() {
  return this._defaults;
};

module.exports = Clay;
