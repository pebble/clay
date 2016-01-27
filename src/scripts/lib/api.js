'use strict';

/**
 * A Clay config Item
 * @typedef {object} Clay~Item
 * @property {string} type
 * @property {string} appKey
 * @property {string} id
 * @property {string} content
 * @property {string|boolean} default
 * @property {string} label
 * @property {object} attributes
 * @property {Array} options
 * @property {Array} items
 */

var HTML = require('../vendor/minified/minified').HTML;
var _ = require('../vendor/minified/minified')._;
var ApiItem = require('./api-item');

function Api(settings) {
  var self = this;
  var _items = [];
  var _itemsById = {};
  var _itemsByAppKey = {};
  var _settings = _.copyObj(settings);

  Object.defineProperties(self, {
    getItemByAppKey: {
      value: function(key) {
        return _itemsByAppKey[key];
      }
    },

    getItemById: {
      value: function(key) {
        return _itemsById[key];
      }
    },

    getItemsByType: {
      value: function(type) {
        return _items.filter(function(item) {
          return item.config.type === type;
        });
      }
    },

    getSettings: {
      value: function() {
        _.eachObj(_itemsByAppKey, function(appKey, item) {
          _settings[appKey] = item.get();
        });
        return _settings;
      }
    },

    addItem: {
      value: function(item, $container) {
        if (Array.isArray(item)) {
          item.forEach(function(item) {
            self.addItem(item, $container);
          });
        } else if (item.type === 'section') {
          var $wrapper = HTML('<div class="section">');
          $container.add($wrapper);
          self.addItem(item.items, $wrapper);
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
      }
    }
  });
}

module.exports = Api;
