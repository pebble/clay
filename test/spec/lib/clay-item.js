'use strict';

var assert = require('chai').assert;
var ClayItem = require('../../../src/scripts/lib/clay-item');
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

describe('ClayItem', function() {
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
    var apiItem = new ClayItem(fixture('input'));
    checkReadOnly(apiItem, properties);
  });

  it('attaches the manipulator methods', function() {
    Object.keys(items).forEach(function(itemName) {
      var clayItem = new ClayItem(fixture(itemName));
      var manipulator = items[itemName].manipulator;
      checkReadOnly(clayItem, Object.keys(manipulator));
    });
  });

  describe('.id', function() {
    it('sets id correctly', function() {
      var config = fixture('input');
      var clayItem = new ClayItem(config);
      assert.strictEqual(clayItem.id, config.id);
    });
  });

  describe('.appKey', function() {
    it('sets appKey correctly', function() {
      var config = fixture('input');
      var clayItem = new ClayItem(config);
      assert.strictEqual(clayItem.appKey, config.appKey);
    });
  });
  
  describe('.$manipulatorTarget', function() {
    
  });

});
