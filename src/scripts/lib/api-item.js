'use strict';

var itemTypes = require('./items');
var $ = require('../vendor/minified/minified').$;
var _ = require('../vendor/minified/minified')._;
var HTML = require('../vendor/minified/minified').HTML;

function ApiItem(config) {
  var self = this;

  var eventProxies = {};
  var itemType = itemTypes[config.type];
  var templateData = _.extend({}, itemType.defaults, config);

  var $element = HTML(_.formatHtml(itemType.template, templateData));
  var $manipulatorTarget = $element.select('[data-manipulator-target]');

  // this caters for situations where the manipulator target is the root element
  if (!$manipulatorTarget.length) {
    $manipulatorTarget = $element;
  }

  Object.defineProperties(self, {
    id: {
      value: config.id || null
    },

    appKey: {
      value: config.appKey || null
    },

    config: {
      value: config || null
    },

    $element: {
      value: $element
    },

    $manipulatorTarget: {
      value: $manipulatorTarget
    },

    on: {
      value: function(events, handler) {
        eventProxies[handler] = function() {
          handler.apply(self, arguments);
        };
        return $manipulatorTarget.on(events, eventProxies[handler]);
      }
    },

    one: {
      value: function(events, handler) {
        eventProxies[handler] = function(event) {
          handler.apply(self, arguments);
          $.off(eventProxies[handler]);
        };
        return $manipulatorTarget.on(events, eventProxies[handler]);
      }
    },

    off: {
      value: function(handler) {
        return $.off(eventProxies[handler]);
      }
    },

    trigger: {
      value: $manipulatorTarget.trigger.bind($manipulatorTarget)
    },

    initialize: {
      value: typeof itemType.initialize === 'function' ?
        itemType.initialize.bind(self) :
        function() {}
    }
  });

  // attach the manipulator methods to the apiItem
  _.eachObj(itemType.manipulator, function(methodName, method) {
    Object.defineProperty(self, methodName, { value: method.bind(self) });
  });

  self.initialize();
}

module.exports = ApiItem;
