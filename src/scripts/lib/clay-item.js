'use strict';

var componentRegistry = require('./component-registry');
var _ = require('../vendor/minified/minified')._;
var HTML = require('../vendor/minified/minified').HTML;
var utils = require('../lib/utils');
var ClayEvents = require('./clay-events');

/**
 * @extends ClayEvents
 * @param config
 * @constructor
 */
function ClayItem(config) {
  var self = this;

  var _itemType = componentRegistry[config.type];

  if (!_itemType) {
    throw new Error('the component: ' + config.type + ' is not registered. ' +
                    'Make sure to register it with ClayConfig.registerComponent()');
  }

  var _templateData = _.extend({}, _itemType.defaults, config);

  /** @type {string|null} */
  self.id = config.id || null;

  /** @type {string|null} */
  self.appKey = config.appKey || null;

  /** @type {object} */
  self.config = config;

  /** @type {M} */
  self.$element = HTML(_.formatHtml(_itemType.template, _templateData));

  /** @type {M} */
  self.$manipulatorTarget = self.$element.select('[data-manipulator-target]');

  // this caters for situations where the manipulator target is the root element
  if (!self.$manipulatorTarget.length) {
    self.$manipulatorTarget = self.$element;
  }

  /**
   * Run the initializer if it exists.
   * @returns {ClayItem}
   */
  self.initialize = function() {
    if (typeof _itemType.initialize === 'function') {
      _itemType.initialize.apply(self, arguments);
    }
    return self;
  };

  // attach event methods
  ClayEvents.call(self, self.$manipulatorTarget);

  // attach the manipulator methods to the clayItem
  _.eachObj(_itemType.manipulator, function(methodName, method) {
    self[methodName] = method.bind(self);
  });

  // prevent external modifications of properties
  utils.updateProperties(self, { writable: false, configurable: false });
}

module.exports = ClayItem;
