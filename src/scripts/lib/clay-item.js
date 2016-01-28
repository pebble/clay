'use strict';

var itemTypes = require('./items');
var $ = require('../vendor/minified/minified').$;
var _ = require('../vendor/minified/minified')._;
var HTML = require('../vendor/minified/minified').HTML;
var utils = require('../lib/utils');

function ClayItem(config) {
  var self = this;

  var _eventProxies = {};
  var _itemType = itemTypes[config.type];
  var _templateData = _.extend({}, _itemType.defaults, config);

  /** @type {string|null} */
  self.id = config.id || null;

  /** @type {string|null} */
  self.appKey = config.appKey || null;

  /** @type {object|null} */
  self.config = config || null;

  /** @type {M} */
  self.$element = HTML(_.formatHtml(_itemType.template, _templateData));

  /** @type {M} */
  self.$manipulatorTarget = self.$element.select('[data-manipulator-target]');

  // this caters for situations where the manipulator target is the root element
  if (!self.$manipulatorTarget.length) {
    self.$manipulatorTarget = self.$element;
  }

  /**
   * Attach an event listener to the item. This proxies minified.js' on.
   * If you are using a native event like "change", consider using "|change" instead
   * as this will allow the native events to still work
   * @see {@link http://minifiedjs.com/api/on.html|.on()}
   * @param {string} events
   * @param {function} handler
   * @returns {ClayItem}
   */
  self.on = function(events, handler) {
    _eventProxies[handler] = function() {
      handler.apply(self, arguments);
    };
    self.$manipulatorTarget.on(events, _eventProxies[handler]);
    return self;
  };

  /**
   * Attach an event listener to the item. This proxies minified.js' one.
   * If you are using a native event like "change", consider using "|change" instead
   * as this will allow the native events to still work
   * @see {@link http://minifiedjs.com/api/one.html|.one()}
   * @param {string} events
   * @param {function} handler
   * @returns {ClayItem}
   */
  self.one = function(events, handler) {
    _eventProxies[handler] = function(event) {
      handler.apply(self, arguments);
      $.off(_eventProxies[handler]);
    };
    self.$manipulatorTarget.on(events, _eventProxies[handler]);
    return self;
  };

  /**
   * Remove the given event handler.
   * @see {@link http://minifiedjs.com/api/off.html|$.off()}
   * @param {function} handler
   * @returns {ClayItem}
   */
  self.off = function(handler) {
    return $.off(_eventProxies[handler]);
  };

  /**
   * trigger an event. This proxies minified.js' trigger.
   * @param {string} name - a single event name to trigger
   * @param {object} eventObj - an object to pass to the event handler, provided the
   * handler does not have custom arguments.
   * @see {@link http://minifiedjs.com/api/trigger.html|.trigger()}
   * @returns {ClayItem}
   */
  self.trigger = function(name, eventObj) {
    self.$manipulatorTarget.trigger(name, eventObj);
    return self;
  };

  /**
   * Run the initializer. This will automatically be run on item creation.
   * @returns {ClayItem}
   */
  self.initialize = function() {
    if (typeof _itemType.initialize === 'function') {
      _itemType.initialize.apply(self, arguments);
    }
    return self;
  };

  // attach the manipulator methods to the clayItem
  _.eachObj(_itemType.manipulator, function(methodName, method) {
    self[methodName] = method.bind(self);
  });

  self.initialize();

  // prevent external modifications of properties
  utils.updateProperties(self, { writable: false, configurable: false });
}

module.exports = ClayItem;
