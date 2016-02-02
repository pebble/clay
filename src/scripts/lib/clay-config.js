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
var ClayItem = require('./clay-item');
var utils = require('../lib/utils');
var ClayEvents = require('./clay-events');
var componentStore = require('./component-registry');

/**
 * @extends ClayEvents
 * @param settings
 * @param config
 * @param $rootContainer
 * @constructor
 */
function ClayConfig(settings, config, $rootContainer) {
  var self = this;

  self.test = Math.random();

  var _settings = _.copyObj(settings);
  var _items = [];
  var _itemsById = {};
  var _itemsByAppKey = {};

  self.EVENTS = {
    /**
     * Called before framework has initialized. This is when you would attach your
     * custom components.
     * @const
     */
    BEFORE_BUILD: 'BEFORE_BUILD',

    /**
     * Called after the config has been parsed and all components have their initial value
     * set
     * @const
     */
    AFTER_BUILD: 'AFTER_BUILD'
  };
  utils.updateProperties(self.EVENTS, {writable: false});

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
   * Register a component to Clay. This must be called prior to .build();
   * @param {{}} component - the clay component to register
   * @param {string} component.name - the name of the component
   * @param {string} component.template - HTML template to use for the component
   * @param {{}} component.manipulator - methods to attach to the component
   * @param {function} component.manipulator.set - set manipulator method
   * @param {function} component.manipulator.get - get manipulator method
   * @param {{}} component.defaults - template defaults
   * @param {function} [component.initialize] - method to scaffold the component
   */
  self.registerComponent = function(component) {
    componentStore[component.name] = component;
  };

  self.build = function() {
    self.trigger(self.EVENTS.BEFORE_BUILD);
    // initialize the config
    _addItems(config, $rootContainer);
    self.trigger(self.EVENTS.AFTER_BUILD);
  };

  // attach event methods
  ClayEvents.call(self, $rootContainer);

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
      var clayItem = new ClayItem(item).initialize();

      if (item.id) {
        _itemsById[item.id] = clayItem;
      }

      if (item.appKey) {
        _itemsByAppKey[item.appKey] = clayItem;
      }

      _items.push(clayItem);

      // set the value of the item via the manipulator to ensure consistency
      var value = typeof _settings[item.appKey] !== 'undefined' ?
        _settings[item.appKey] :
        (item.value || '');

      clayItem.set(value);

      $container.add(clayItem.$element);
    }
  };

  // prevent external modifications of properties
  utils.updateProperties(self, { writable: false, configurable: false });

}

module.exports = ClayConfig;
