'use strict';

/**
 * A Clay config Item
 * @typedef {object} Clay~ConfigItem
 * @property {string} type
 * @property {string|boolean|number} value
 * @property {string} [appKey]
 * @property {string} [id]
 * @property {string} [label]
 * @property {object} [attributes]
 * @property {array} [options]
 * @property {array} [items]
 */

var HTML = require('../vendor/minified/minified').HTML;
var _ = require('../vendor/minified/minified')._;
var ApiItem = require('./clay-item');
var utils = require('../lib/utils');

function ClayConfig(settings, config, $rootContainer) {
  var self = this;

  var _settings = _.copyObj(settings);
  var _items = [];
  var _itemsById = {};
  var _itemsByAppKey = {};

  /**
   * @param {string} key
   * @returns {ClayItem}
   */
  self.getItemByAppKey = function(key) {
    return _itemsByAppKey[key];
  };

  /**
   * @param {string} key
   * @returns {ClayItem}
   */
  self.getItemById = function(key) {
    return _itemsById[key];
  };

  /**
   * @param {string} key
   * @returns {[ClayItem]}
   */
  self.getItemsByType = function(type) {
    return _items.filter(function(item) {
      return item.config.type === type;
    });
  };

  /**
   * @returns {object}
   */
  self.getSettings = function() {
    _.eachObj(_itemsByAppKey, function(appKey, item) {
      _settings[appKey] = item.get();
    });
    return _settings;
  };

  /**
   * Add item(s) to the config
   * @param {Clay~ConfigItem|array} items
   * @param {M} [$container]
   */
  var _addItems = function(item, $container) {
    if (Array.isArray(item)) {
      item.forEach(function(item) {
        _addItems(item, $container);
      });
    } else if (item.type === 'section') {
      var $wrapper = HTML('<div class="section">');
      $container.add($wrapper);
      _addItems(item.items, $wrapper);
    } else {
      var apiItem = new ApiItem(item);

      if (item.id) {
        _itemsById[item.id] = apiItem;
      }

      if (item.appKey) {
        _itemsByAppKey[item.appKey] = apiItem;
      }

      _items.push(apiItem);

      // set the value of the item via the manipulator to ensure consistency
      var value = typeof _settings[item.appKey] !== 'undefined' ?
        _settings[item.appKey] :
        (item.value || '');

      apiItem.set(value);

      $container.add(apiItem.$element);
    }
  };

  // prevent external modifications of properties
  utils.updateProperties(self, { writable: false, configurable: false });

  // initialize the config
  _addItems(config, $rootContainer);
}

module.exports = ClayConfig;
