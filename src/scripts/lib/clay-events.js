'use strict';

var $ = require('../vendor/minified/minified').$;

function ClayEvents($eventTarget) {
  var self = this;
  var _eventProxies = {};

  /**
   * Attach an event listener to the item. This proxies minified.js' on.
   * If you are using a native event like "change", consider using "|change" instead
   * as this will allow the native events to still work
   * @see {@link http://minifiedjs.com/api/on.html|.on()}
   * @param {string} events
   * @param {function} handler
   * @returns {object}
   */
  self.on = function(events, handler) {
    var self = this;
    _eventProxies[handler] = function() {
      handler.apply(self, arguments);
    };
    $eventTarget.on(events, _eventProxies[handler]);
    return self;
  };

  /**
   * Attach an event listener to the item. This proxies minified.js' one.
   * If you are using a native event like "change", consider using "|change" instead
   * as this will allow the native events to still work
   * @see {@link http://minifiedjs.com/api/one.html|.one()}
   * @param {string} events
   * @param {function} handler
   * @returns {object}
   */
  self.one = function(events, handler) {
    var self = this;
    _eventProxies[handler] = function(event) {
      handler.apply(self, arguments);
      $.off(_eventProxies[handler]);
    };
    $eventTarget.on(events, _eventProxies[handler]);
    return self;
  };

  /**
   * Remove the given event handler.
   * @see {@link http://minifiedjs.com/api/off.html|$.off()}
   * @param {function} handler
   * @returns {object}
   */
  self.off = function(handler) {
    $.off(_eventProxies[handler]);
    return self;
  };

  /**
   * trigger an event. This proxies minified.js' trigger.
   * @param {string} name - a single event name to trigger
   * @param {object} eventObj - an object to pass to the event handler, provided the
   * handler does not have custom arguments.
   * @see {@link http://minifiedjs.com/api/trigger.html|.trigger()}
   * @returns {object}
   */
  self.trigger = function(name, eventObj) {
    $eventTarget.trigger(name, eventObj);
    return self;
  };
}

module.exports = ClayEvents;
