'use strict';
var sinon = require('sinon');
var assert = require('chai').assert;
var ClayEvents = require('../../../src/scripts/lib/clay-events');
var $ = require('../../../src/scripts/vendor/minified').$;
var HTML = require('../../../src/scripts/vendor/minified').HTML;

/**
 * @extends ClayEvents
 */
var ctx;

var eventCounter = 0;

/**
 * Create a unique event name
 * @returns {string}
 */
function createEventName() {
  eventCounter++;
  return 'test-event-' + eventCounter;
}

describe('ClayEvents', function() {

  beforeEach(function() {
    ctx = {};
    ClayEvents.call(ctx, $(HTML('<div>')));
  });

  it('registers the methods on the context', function() {
    ['on', 'off', 'trigger'].forEach(function(method) {
      assert.typeOf(ctx[method], 'function');
    });
  });

  describe('.on()', function() {
    it('registers one event', function() {
      var eventName = createEventName();
      var eventHandlerSpy = sinon.spy();

      ctx.on(eventName, eventHandlerSpy);
      ctx.trigger(eventName);
      ctx.trigger(eventName);

      assert(eventHandlerSpy.calledTwice, 'handler not called 2 times');
      assert(eventHandlerSpy.alwaysCalledOn(ctx), 'handler not called on ctx');
    });

    it('registers multiple events', function() {
      var eventName1 = createEventName();
      var eventName2 = createEventName();
      var eventHandlerSpy = sinon.spy();

      ctx.on(eventName1 + ' ' + eventName2, eventHandlerSpy);
      ctx.trigger(eventName1);
      ctx.trigger(eventName1);
      ctx.trigger(eventName2);
      ctx.trigger(eventName2);

      assert.strictEqual(eventHandlerSpy.callCount, 4, 'handler not called 4 times');
      assert(eventHandlerSpy.alwaysCalledOn(ctx), 'handler not called on ctx');
    });
  });

  describe('.off()', function() {
    it('deregisters the handler for all events on the context', function() {
      var eventName1 = createEventName();
      var eventName2 = createEventName();
      var eventHandlerSpy = sinon.spy();

      var ctx1 = ctx;
      var ctx2 = {};
      ClayEvents.call(ctx2, $(HTML('<div>')));

      ctx.id = 1;
      ctx1.on(eventName1, eventHandlerSpy);
      ctx1.on(eventName2, eventHandlerSpy);
      ctx2.on(eventName2, eventHandlerSpy);

      ctx1.trigger(eventName1);
      ctx1.trigger(eventName2);
      ctx2.trigger(eventName2);

      ctx1.off(eventHandlerSpy);

      ctx1.trigger(eventName1);
      ctx1.trigger(eventName2);
      ctx2.trigger(eventName2);

      assert.strictEqual(eventHandlerSpy.callCount, 4, 'handler not called 4 times');
    });

    it('does nothing if the handler does not exist', function() {
      // register a fake event so _getEventProxy() has something to look for
      ctx.on(createEventName(), sinon.spy());

      assert.doesNotThrow(function() {
        ctx.off(sinon.spy());
      });
    });
  });

  describe('.trigger()', function() {
    it('triggers the handler for the event with custom data', function() {
      var eventName = createEventName();
      var eventHandlerSpy = sinon.spy();
      var customData = {foo: 'bar'};

      ctx.on(eventName, eventHandlerSpy);
      ctx.trigger(eventName, customData);

      assert(eventHandlerSpy.calledOnce, 'handler not called 2 times');
      assert(eventHandlerSpy.alwaysCalledOn(ctx), 'handler not called on ctx');
      assert(eventHandlerSpy.calledWith(customData), 'handler not called on ctx');
    });
  });
});
