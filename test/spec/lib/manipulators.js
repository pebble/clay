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
        var clayItem = fixture.clayConfig([itemType]).getAllItems()[0];
        clayItem.on('change', handlerSpy);

        clayItem.set(value);
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
    var type = 'text';
    testSetGet(type, 'test123');
    testSetGet(type, '<span>some HTML</span>');
    testShow(type);
    testHide(type);
  });

  describe('button', function() {
    var type = 'button';
    testSetGet(type, 'test123');
    testSetGet(type, '<span>some HTML</span>');
    testDisable(type);
    testEnable(type);
    testShow(type);
    testHide(type);
  });

  describe('val', function() {
    var type = 'input';
    testSetGet(type, 'test321');
    testSetGet(type, 1234, '1234');
    testDisable(type);
    testEnable(type);
    testShow(type);
    testHide(type);
  });

  describe('slider', function() {
    var type = {
      type: 'slider',
      min: 0,
      max: 100,
      step: 0.1
    };

    testSetGet(type, '12', 12);
    testSetGet(type, 12);
    testSetGet(type, '12.3', 12.3);
    testSetGet(type, 12.3);
    testSetGet(type, 12.34, 12.3);
    testSetGet(type, '12.34', 12.3);
    testDisable(type);
    testEnable(type);
    testShow(type);
    testHide(type);
  });

  describe('checked', function() {
    var type = 'toggle';
    testSetGet({type: type, defaultValue: false}, 1, true);
    testSetGet({type: type, defaultValue: false}, true);
    testSetGet({type: type, defaultValue: true}, 0, false);
    testSetGet({type: type, defaultValue: true}, false);
    testDisable(type);
    testEnable(type);
    testShow(type);
    testHide(type);
  });

  describe('radiogroup', function() {
    var type = {
      type: 'radiogroup',
      clayId: 1,
      options: [
        { label: '1', value: 'one' },
        { label: '2', value: 'two' },
        { label: '3', value: 'three "quote' }
      ]
    };
    testSetGet(type, 'one');
    testSetGet(type, 'two');
    testSetGet(type, 'three "quote');
    testDisable(type);
    testEnable(type);
    testShow(type);
    testHide(type);
  });

  describe('checkboxgroup', function() {
    var type = {
      type: 'checkboxgroup',
      clayId: 1,
      defaultValue: ['two'],
      options: [
        { label: '1', value: 'one' },
        { label: '2', value: 'two' },
        { label: '3', value: 'three "quote' }
      ]
    };
    testSetGet(type, ['one', 'two']);
    testSetGet(type, ['three "quote']);
    testSetGet(type, []);
    testSetGet(type, false, []);
    testDisable(type);
    testEnable(type);
    testShow(type);
    testHide(type);
  });

  describe('color', function() {
    var type = 'color';
    testSetGet(type, 'FF0000', 0xff0000);
    testSetGet(type, '#FF0000', 0xff0000);
    testSetGet(type, '0xFF0000', 0xff0000);
    testSetGet(type, '#ff0000', 0xff0000);
    testSetGet(type, 0xff0000, 0xff0000);
    testSetGet({type: type, defaultValue: 0x00ff00}, '', 0x000000);
    testSetGet({type: type, defaultValue: 0x00ff00}, false, 0x000000);
    testSetGet({type: type, defaultValue: 0x00ff00}, undefined, 0x000000);
    testDisable(type);
    testEnable(type);
    testShow(type);
    testHide(type);
  });
});
