'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var fixture = require('../../fixture');

describe('manipulators', function() {

  /**
   * @param {string} itemType
   * @param {*} value
   * @return {void}
   */
  function testSetGet(itemType, value) {
    describe('.set() and .get()', function() {
      it('sets and gets the value then triggers a "change" event', function() {
        var handlerSpy = sinon.spy();
        var clayItem = fixture.clayItem(itemType);
        clayItem.on('change', handlerSpy);

        clayItem.set(value);
        assert.strictEqual(clayItem.get(), value);
        assert.strictEqual(handlerSpy.callCount, 1, 'handler not called once');
        assert(handlerSpy.calledOn(clayItem), 'handler not called on clayItem');
      });
    });
  }

  /**
   * @param {string} itemType
   * @return {void}
   */
  function testDisable(itemType) {
    describe('.disable()', function() {
      it('disables the field then triggers a "disabled" event', function() {
        var handlerSpy = sinon.spy();
        var clayItem = fixture.clayItem(itemType);
        clayItem.on('disabled', handlerSpy);

        clayItem.disable();
        assert.strictEqual(clayItem.$manipulatorTarget.get('disabled'), true);
        assert.strictEqual(handlerSpy.callCount, 1, 'handler not called once');
        assert(handlerSpy.calledOn(clayItem), 'handler not called on clayItem');
      });
    });
  }

  /**
   * @param {string} itemType
   * @return {void}
   */
  function testEnable(itemType) {
    describe('.disable()', function() {
      it('disables the field then triggers an "enabled" event', function() {
        var handlerSpy = sinon.spy();
        var clayItem = fixture.clayItem(itemType);
        clayItem.on('enabled', handlerSpy);

        clayItem.enable();
        assert.strictEqual(clayItem.$manipulatorTarget.get('disabled'), false);
        assert.strictEqual(handlerSpy.callCount, 1, 'handler not called once');
        assert(handlerSpy.calledOn(clayItem), 'handler not called on clayItem');
      });
    });
  }

  describe('html', function() {
    testSetGet('footer', 'test123');
  });

  describe('val', function() {
    testSetGet('input', 'test321');
    testDisable('input');
    testEnable('input');
  });

  describe('checked', function() {
    testSetGet('toggle', true);
    testSetGet('toggle', false);
    testDisable('toggle');
    testEnable('toggle');
  });
});
