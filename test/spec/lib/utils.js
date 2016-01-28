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
});


