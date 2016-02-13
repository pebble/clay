'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var fixture = require('../../fixture');

describe('manipulators', function() {

  /**
   * @param {string} itemType
   * @param {*} value
   * @param {*} [expected]
   * @return {void}
   */
  function testSetGet(itemType, value, expected) {
    expected = typeof expected === 'undefined' ? value : expected;

    describe('.set() and .get()', function() {
      it('sets: "' + value + '" and gets: "' + expected + '" then triggers "change"',
      function() {
        var handlerSpy = sinon.spy();
        var clayItem = fixture.clayItem(itemType);
        clayItem.on('change', handlerSpy);

        clayItem.set(value);
        assert.strictEqual(clayItem.get(), expected);
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

  describe('color', function() {
    testSetGet('color', 'FF0000', 0xff0000);
    testSetGet('color', '#FF0000', 0xff0000);
    testSetGet('color', '0xFF0000', 0xff0000);
    testSetGet('color', '#ff0000', 0xff0000);
    testSetGet('color', 0xff0000, 0xff0000);
    testSetGet('color', '', 0x000000);
    testSetGet('color', false, 0x000000);
    testSetGet('color', undefined, 0x000000);
    testDisable('color');
    testEnable('color');
  });
});
