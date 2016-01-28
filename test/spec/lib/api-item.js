'use strict';

var assert = require('chai').assert;
var ApiItem = require('../../../src/scripts/lib/clay-item');
var fixture = require('../../fixture');
var items = require('../../../src/scripts/lib/items');

/**
 * @param {Object} object
 * @param {Array} properties
 */
function checkReadOnly(object, properties) {
  properties.forEach(function(property) {
    assert.strictEqual(
      Object.getOwnPropertyDescriptor(object, property).writable,
      false
    );
  });
}

describe('ApiItem', function() {
  it('defines read-only properties', function() {
    var properties = [
      'id',
      'appKey',
      'config',
      '$element',
      '$manipulatorTarget',
      'on',
      'one',
      'off',
      'trigger',
      'initialize'
    ];
    var apiItem = new ApiItem(fixture('input'));
    checkReadOnly(apiItem, properties);
  });

  it('attaches the manipulator methods', function() {
    Object.keys(items).forEach(function(itemName) {
      var apiItem = new ApiItem(fixture(itemName));
      var manipulator = items[itemName].manipulator;
      checkReadOnly(apiItem, Object.keys(manipulator));
    });
  });
});
