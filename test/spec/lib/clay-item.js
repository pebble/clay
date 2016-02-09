'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var checkReadOnly = require('../../test-utils').checkReadOnly;
var ClayItem = require('../../../src/scripts/lib/clay-item');
var minified = require('../../../src/scripts/vendor/minified');
var clayItemFixture = require('../../fixture').clayItem;
var configItemFixture = require('../../fixture').configItem;
var componentRegistry = require('../../../src/scripts/lib/component-registry');

describe('ClayItem', function() {
  it('defines read-only properties', function() {
    var properties = [
      'id',
      'appKey',
      'config',
      '$element',
      '$manipulatorTarget',
      'on',
      'off',
      'trigger',
      'initialize'
    ];
    var clayItem = clayItemFixture('input');
    checkReadOnly(clayItem, properties);
  });

  it('attaches the manipulator methods', function() {
    Object.keys(componentRegistry).forEach(function(itemName) {
      var clayItem = clayItemFixture(itemName);
      var manipulator = componentRegistry[itemName].manipulator;
      checkReadOnly(clayItem, Object.keys(manipulator));
    });
  });

  it('throws if a component is not in the registry', function() {
    var config = configItemFixture('fake');
    /* eslint-disable no-new */
    assert.throws(function() { new ClayItem(config); }, /fake/);
    /* eslint-enable no-new */
  });

  describe('.id', function() {
    it('sets id if config has id', function() {
      var config = configItemFixture('input');
      var clayItem = new ClayItem(config);
      assert.strictEqual(clayItem.id, config.id);
    });

    it('sets id to null if there is no id in the config', function() {
      var clayItem = clayItemFixture({type: 'input', id: undefined});
      assert.strictEqual(clayItem.id, null);
    });
  });

  describe('.appKey', function() {
    it('sets appKey correctly', function() {
      var config = configItemFixture('input');
      var clayItem = new ClayItem(config);
      assert.strictEqual(clayItem.appKey, config.appKey);
    });

    it('sets appKey to null if there is no appKey in the config', function() {
      var clayItem = clayItemFixture({type: 'input', appKey: undefined});
      assert.strictEqual(clayItem.appKey, null);
    });
  });

  describe('.config', function() {
    it('sets appKey correctly', function() {
      var config = configItemFixture('input');
      var clayItem = new ClayItem(config);
      assert.strictEqual(clayItem.appKey, config.appKey);
    });
  });

  describe('.$element', function() {
    it('sets $element correctly', function() {
      var clayItem = clayItemFixture('input');
      assert.strictEqual(clayItem.$element[0].tagName, 'LABEL');
    });
  });

  describe('.$manipulatorTarget', function() {
    it('sets the $manipulatorTarget to the root element if there are no children',
    function() {
      var clayItem = clayItemFixture('footer');
      assert.strictEqual(clayItem.$manipulatorTarget, clayItem.$element);
    });
    it('sets the $manipulatorTarget to the correct child element', function() {
      var clayItem = clayItemFixture('input');
      assert.strictEqual(clayItem.$manipulatorTarget[0].tagName, 'INPUT');
    });
  });

  describe('.initialize()', function() {
    it('calls component initializer  with the ClayItem as context', function() {
      var initializeSpy = sinon.spy(componentRegistry.select, 'initialize');
      var clayItem = clayItemFixture('select').initialize();
      assert(initializeSpy.alwaysCalledOn(clayItem));
      assert(initializeSpy.alwaysCalledWith(minified));
      initializeSpy.restore();
    });

    it('returns itself for chaining', function() {
      var clayItem = clayItemFixture('select');
      assert.strictEqual(clayItem.initialize(), clayItem);
    });

    it('does nothing if there is no initialize function', function() {
      assert.doesNotThrow(clayItemFixture('input').initialize);
    });
  });

});
