'use strict';

/**
 * A Clay config Item
 * @typedef {Object} Clay~ConfigItem
 * @property {string} type
 * @property {string|boolean|number} defaultValue
 * @property {string} [appKey]
 * @property {string} [id]
 * @property {string} [label]
 * @property {Object} [attributes]
 * @property {Array} [options]
 * @property {Array} [items]
 */

var HTML = require('../vendor/minified').HTML;
var _ = require('../vendor/minified')._;
var ClayItem = require('./clay-item');
var utils = require('../lib/utils');
var ClayEvents = require('./clay-events');
var componentStore = require('./component-registry');
var manipulators = require('./manipulators');

/**
 * @extends ClayEvents
 * @param {Object} settings - setting that were set from a previous session
 * @param {Array|Object} config
 * @param {M} $rootContainer
 * @param {Object} meta
 * @constructor
 */
function ClayConfig(settings, config, $rootContainer, meta) {
  var self = this;

  var _settings = _.copyObj(settings);
  var _items = [];
  var _itemsById = {};
  var _itemsByAppKey = {};
  var _isBuilt = false;

  /**
   * Add item(s) to the config
   * @param {Clay~ConfigItem|Array} item
   * @param {M} $container
   * @return {void}
   */
  function _addItems(item, $container) {
    if (Array.isArray(item)) {
      item.forEach(function(item) {
        _addItems(item, $container);
      });
    } else if (item.type === 'section') {
      var $wrapper = HTML('<div class="section">');
      $container.add($wrapper);
      _addItems(item.items, $wrapper);
    } else {
      var _item = _.copyObj(item);
      _item.clayId = _items.length;

      var clayItem = new ClayItem(_item).initialize(self);

      if (_item.id) {
        _itemsById[_item.id] = clayItem;
      }

      if (_item.appKey) {
        _itemsByAppKey[_item.appKey] = clayItem;
      }

      _items.push(clayItem);

      // set the value of the item via the manipulator to ensure consistency
      var value = typeof _settings[_item.appKey] !== 'undefined' ?
        _settings[_item.appKey] :
        (_item.defaultValue || '');

      clayItem.set(value);

      $container.add(clayItem.$element);
    }
  }

  /**
   * Throws if the config has not been built yet.
   * @param {string} fnName
   * @returns {boolean}
   * @private
   */
  function _checkBuilt(fnName) {
    if (!_isBuilt) {
      throw new Error(
        'ClayConfig not built. build() must be run before ' +
        'you can run ' + fnName + '()'
      );
    }
    return true;
  }

  self.meta = meta;

  self.EVENTS = {
    /**
     * Called before framework has initialized. This is when you would attach your
     * custom components.
     * @const
     */
    BEFORE_BUILD: 'BEFORE_BUILD',

    /**
     * Called after the config has been parsed and all components have their initial
     * value set
     * @const
     */
    AFTER_BUILD: 'AFTER_BUILD'
  };
  utils.updateProperties(self.EVENTS, {writable: false});

  /**
   * @returns {Array.<ClayItem>}
   */
  self.getAllItems = function() {
    _checkBuilt('getAllItems');
    return _items;
  };

  /**
   * @param {string} appKey
   * @returns {ClayItem}
   */
  self.getItemByAppKey = function(appKey) {
    _checkBuilt('getItemByAppKey');
    return _itemsByAppKey[appKey];
  };

  /**
   * @param {string} id
   * @returns {ClayItem}
   */
  self.getItemById = function(id) {
    _checkBuilt('getItemById');
    return _itemsById[id];
  };

  /**
   * @param {string} type
   * @returns {Array.<ClayItem>}
   */
  self.getItemsByType = function(type) {
    _checkBuilt('getItemsByType');
    return _items.filter(function(item) {
      return item.config.type === type;
    });
  };

  /**
   * @returns {Object}
   */
  self.getSettings = function() {
    _checkBuilt('getSettings');
    _.eachObj(_itemsByAppKey, function(appKey, item) {
      _settings[appKey] = item.get();
    });
    return _settings;
  };

  // @todo maybe don't do this and force the static method
  self.registerComponent = ClayConfig.registerComponent;

  /**
   * Build the config page. This must be run before any of the get methods can be run
   * @returns {ClayConfig}
   */
  self.build = function() {
    self.trigger(self.EVENTS.BEFORE_BUILD);
    _addItems(config, $rootContainer);
    _isBuilt = true;
    self.trigger(self.EVENTS.AFTER_BUILD);
    return self;
  };

  // attach event methods
  ClayEvents.call(self, $rootContainer);

  // prevent external modifications of properties
  utils.updateProperties(self, { writable: false, configurable: false });

  // expose the config to allow developers to update it before the build is run
  self.config = config;
}

/**
 * Register a component to Clay. This must be called prior to .build();
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
ClayConfig.registerComponent = function(component) {
  var _component = _.copyObj(component);

  if (componentStore[_component.name]) {
    console.warn('Component: ' + _component.name +
                 ' is already registered. If you wish to override the existing' +
                 ' functionality, you must provide a new name');
    return false;
  }

  if (typeof _component.manipulator === 'string') {
    _component.manipulator = manipulators[component.manipulator];

    if (!_component.manipulator) {
      throw new Error('The manipulator: ' + component.manipulator +
                      ' does not exist in the built-in manipulators.');
    }
  }

  if (!_component.manipulator) {
    throw new Error('The manipulator must be defined');
  }

  if (typeof _component.manipulator.set !== 'function' ||
      typeof _component.manipulator.get !== 'function') {
    throw new Error('The manipulator must have both a `get` and `set` method');
  }

  if (_component.style) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(_component.style));
    document.head.appendChild(style);
  }

  componentStore[_component.name] = _component;
  return true;
};

module.exports = ClayConfig;
