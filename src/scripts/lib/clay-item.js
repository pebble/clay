'use strict';

var itemTypes = require('./items');
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
   * Run the initializer. This will automatically be run on item creation.
   * @returns {ClayItem}
   */
  self.initialize = function() {
    if (typeof _itemType.initialize === 'function') {
      _itemType.initialize.apply(self, arguments);
    }
    return self;
  };

  ClayEvents.call(this, self.$manipulatorTarget);

  // attach the manipulator methods to the clayItem
  _.eachObj(_itemType.manipulator, function(methodName, method) {
    self[methodName] = method.bind(self);
  });

  self.initialize();

  // prevent external modifications of properties
  utils.updateProperties(self, { writable: false, configurable: false });
}

module.exports = ClayItem;
