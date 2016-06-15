'use strict';

var componentRegistry = require('./component-registry');
var minified = require('../vendor/minified');
var utils = require('../lib/utils');
var ClayEvents = require('./clay-events');

var _ = minified._;
var HTML = minified.HTML;

/**
 * @extends ClayEvents
 * @param {Clay~ConfigItem} config
 * @constructor
 */
function ClayItem(config) {
  var self = this;

  var _component = componentRegistry[config.type];

  if (!_component) {
    throw new Error('The component: ' + config.type + ' is not registered. ' +
                    'Make sure to register it with ClayConfig.registerComponent()');
  }

  var _templateData = _.extend({}, _component.defaults || {}, config);

  /** @type {string|null} */
  self.id = config.id || null;

  /** @type {string|null} */
  self.messageKey = config.messageKey || null;

  /** @type {Object} */
  self.config = config;

  /** @type {M} */
  self.$element = HTML(_component.template.trim(), _templateData);

  /** @type {M} */
  self.$manipulatorTarget = self.$element.select('[data-manipulator-target]');

  // this caters for situations where the manipulator target is the root element
  if (!self.$manipulatorTarget.length) {
    self.$manipulatorTarget = self.$element;
  }

  /**
   * Run the initializer if it exists and attaches the css to the head.
   * Passes minified as the first param
   * @param {ClayConfig} clay
   * @returns {ClayItem}
   */
  self.initialize = function(clay) {
    if (typeof _component.initialize === 'function') {
      _component.initialize.call(self, minified, clay);
    }
    return self;
  };

  // attach event methods
  ClayEvents.call(self, self.$manipulatorTarget);

  // attach the manipulator methods to the clayItem
  _.eachObj(_component.manipulator, function(methodName, method) {
    self[methodName] = method.bind(self);
  });

  // prevent external modifications of properties
  utils.updateProperties(self, { writable: false, configurable: false });
}

module.exports = ClayItem;
