'use strict';

var utils = require('../../../src/scripts/lib/utils');
var assert = require('chai').assert;

describe('Utils', function() {
  describe('.updateProperties', function() {
    var obj;

    beforeEach(function() {
      obj = {
        one: 1,
        two: 2
      };
    });

    it('sets the properties as non-writable', function() {
      utils.updateProperties(obj, { writable: false });
      assert.strictEqual(
        Object.getOwnPropertyDescriptor(obj, 'one').writable,
        false
      );
      assert.strictEqual(
        Object.getOwnPropertyDescriptor(obj, 'two').writable,
        false
      );
    });
  });

  describe('.prepareForAppMessage', function() {
    it('converts an array correctly when array contains strings', function() {
      assert.deepEqual(
        utils.prepareForAppMessage(['one', 'two']),
        ['one', 0, 'two', 0]
      );
    });

    it('converts an array correctly when array contains numbers', function() {
      assert.deepEqual(utils.prepareForAppMessage([1, 2, 3]), [1, 2, 3]);
    });

    it('converts an array correctly when array contains booleans', function() {
      assert.deepEqual(utils.prepareForAppMessage([true, false, true]), [1, 0, 1]);
    });

    it('converts booleans to ints', function() {
      assert.strictEqual(utils.prepareForAppMessage(false), 0);
      assert.strictEqual(utils.prepareForAppMessage(true), 1);
    });

    it('leaves strings alone', function() {
      assert.strictEqual(utils.prepareForAppMessage('test'), 'test');
    });

    it('leaves numbers alone', function() {
      assert.strictEqual(utils.prepareForAppMessage(123), 123);
    });
  });
});
