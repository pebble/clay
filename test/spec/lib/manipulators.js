'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var fixture = require('../../fixture');

describe('manipulators', function() {

  /**
   * @param {string|Object} itemType
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
        assert.deepEqual(clayItem.get(), expected);
        assert.strictEqual(handlerSpy.callCount, 1, 'handler not called once');
        assert(handlerSpy.calledOn(clayItem), 'handler not called on clayItem');
      });
    });
  }

  /**
   * @param {string|Object} itemType
   * @return {void}
   */
  function testDisable(itemType) {
    describe('.disable()', function() {
      it('disables the field then triggers a "disabled" event', function() {
        var handlerSpy = sinon.spy();
        var clayItem = fixture.clayItem(itemType);
        clayItem.on('disabled', handlerSpy);
        assert.strictEqual(
          clayItem.$element[0].classList.contains('disabled'),
          false
        );
        clayItem.disable();
        assert.strictEqual(
          clayItem.$element[0].classList.contains('disabled'),
          true
        );
        assert.strictEqual(clayItem.$manipulatorTarget.get('disabled'), true);
        assert.strictEqual(handlerSpy.callCount, 1, 'handler not called once');
        assert(handlerSpy.calledOn(clayItem), 'handler not called on clayItem');
      });
    });
  }

  /**
   * @param {string|Object} itemType
   * @return {void}
   */
  function testEnable(itemType) {
    describe('.enable()', function() {
      it('enables the field then triggers an "enabled" event', function() {
        var handlerSpy = sinon.spy();
        var clayItem = fixture.clayItem(itemType);
        clayItem.on('enabled', handlerSpy);

        clayItem.disable();
        assert.strictEqual(
          clayItem.$element[0].classList.contains('disabled'),
          true
        );
        clayItem.enable();
        assert.strictEqual(
          clayItem.$element[0].classList.contains('disabled'),
          false
        );
        assert.strictEqual(clayItem.$manipulatorTarget.get('disabled'), false);
        assert.strictEqual(handlerSpy.callCount, 1, 'handler not called once');
        assert(handlerSpy.calledOn(clayItem), 'handler not called on clayItem');
      });
    });
  }

  /**
   * @param {string|Object} itemType
   * @return {void}
   */
  function testHide(itemType) {
    describe('.hide()', function() {
      it('hides the field then triggers a "hide" event', function() {
        var handlerSpy = sinon.spy();
        var clayItem = fixture.clayItem(itemType);
        clayItem.on('hide', handlerSpy);

        assert.strictEqual(
          clayItem.$element[0].classList.contains('hide'),
          false
        );
        clayItem.hide();
        assert.strictEqual(
          clayItem.$element[0].classList.contains('hide'),
          true
        );
        assert.strictEqual(handlerSpy.callCount, 1, 'handler not called once');
        assert(handlerSpy.calledOn(clayItem), 'handler not called on clayItem');
      });
    });
  }

  /**
   * @param {string|Object} itemType
   * @return {void}
   */
  function testShow(itemType) {
    describe('.show()', function() {
      it('shows the field then triggers a "show" event', function() {
        var handlerSpy = sinon.spy();
        var clayItem = fixture.clayItem(itemType);
        clayItem.on('show', handlerSpy);

        clayItem.hide();
        assert.strictEqual(
          clayItem.$element[0].classList.contains('hide'),
          true
        );
        clayItem.show();
        assert.strictEqual(
          clayItem.$element[0].classList.contains('hide'),
          false
        );
        assert.strictEqual(handlerSpy.callCount, 1, 'handler not called once');
        assert(handlerSpy.calledOn(clayItem), 'handler not called on clayItem');
      });
    });
  }

  describe('html', function() {
    testSetGet('text', 'test123');
    testShow('text');
    testHide('text');
  });

  describe('val', function() {
    testSetGet('input', 'test321');
    testDisable('input');
    testEnable('input');
    testShow('text');
    testHide('text');
  });

  describe('checked', function() {
    testSetGet('toggle', true);
    testSetGet('toggle', 1, true);
    testSetGet('toggle', false);
    testSetGet('toggle', 0, false);
    testDisable('toggle');
    testEnable('toggle');
    testShow('toggle');
    testHide('toggle');
  });

  describe('radiogroup', function() {
    var item = {
      type: 'radiogroup',
      clayId: 1,
      options: [
        { label: '1', value: 'one' },
        { label: '2', value: 'two' },
        { label: '3', value: 'three "quote' }
      ]
    };
    testSetGet(item, 'one');
    testSetGet(item, 'two');
    testSetGet(item, 'three "quote');
    testDisable(item);
    testEnable(item);
    testShow(item);
    testHide(item);
  });

  describe('checkboxgroup', function() {
    var item = {
      type: 'checkboxgroup',
      clayId: 1,
      options: [
        { label: '1', value: 'one' },
        { label: '2', value: 'two' },
        { label: '3', value: 'three "quote' }
      ]
    };
    testSetGet(item, ['one', 'two']);
    testSetGet(item, ['three "quote']);
    testSetGet(item, []);
    testSetGet(item, false, []);
    testDisable(item);
    testEnable(item);
    testShow(item);
    testHide(item);
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
    testShow('color');
    testHide('color');
  });
});
