'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var textComponent = require('pebble-clay-components/dist/components/text');
var componentRegistry = require('../../../src/scripts/lib/component-registry');
var checkReadOnly = require('../../test-utils').checkReadOnly;
var fixtures = require('../../fixture');

describe('ClayConfig', function() {
  it('defines read-only properties', function() {
    var properties = [
      'EVENTS',
      'getItemByAppKey',
      'getItemById',
      'getItemsByType',
      'getSettings',
      'registerComponent',
      'build',
      'on',
      'one',
      'off',
      'trigger'
    ];
    var clayConfig = fixtures.clayConfig(['input']);
    checkReadOnly(clayConfig, properties);
  });

  describe('throws when trying to run methods before being built', function() {
    [
      'getItemByAppKey',
      'getItemById',
      'getItemsByType',
      'getSettings'
    ].forEach(function(method) {
      it('.' + method + '()', function() {
        var clayConfig = fixtures.clayConfig(['input', 'text'], true);
        assert.throws(clayConfig[method], new RegExp(method));
      });
    });
  });

  describe('.getAllItems()', function() {
    it('returns an array of all the items', function() {
      var config = fixtures.config(['input', 'text', ['input']]);
      var clayConfig = fixtures.clayConfig(config);
      var allItems = clayConfig.getAllItems();
      assert.strictEqual(allItems.length, 3);
      assert.deepEqual(allItems[0].config, config[0]);
      assert.deepEqual(allItems[1].config, config[1]);
      assert.deepEqual(allItems[2].config, config[2].items[0]);
    });
  });

  describe('.getItemByAppKey()', function() {
    it('it returns the correct item', function() {
      var config = fixtures.config([
        {type: 'input', appKey: 'test-app-key'},
        {type: 'input', appKey: undefined}
      ]);
      var clayConfig = fixtures.clayConfig(config);
      assert.deepEqual(clayConfig.getItemByAppKey('test-app-key').config, config[0]);
    });
  });

  describe('.getItemById()', function() {
    it('it returns the correct item', function() {
      var config = fixtures.config([
        {type: 'input', id: 'test-id'},
        {type: 'input', id: undefined}
      ]);
      var clayConfig = fixtures.clayConfig(config);
      assert.deepEqual(clayConfig.getItemById('test-id').config, config[0]);
    });
  });

  describe('.getItemsByType()', function() {
    it('it returns the correct items', function() {
      var config = fixtures.config(['input', 'text', 'input']);
      var clayConfig = fixtures.clayConfig(config);
      assert.deepEqual(clayConfig.getItemsByType('input')[0].config, config[0]);
      assert.deepEqual(clayConfig.getItemsByType('input')[1].config, config[2]);
    });
  });

  describe('.getSettings()', function() {
    it('returns the correct settings', function() {
      var clayConfig = fixtures.clayConfig(
        [
          {type: 'input', appKey: 'test1', value: 'not this'},
          {type: 'select', appKey: 'test2', options: [
            {label: 'label-1', value: 'val-1'},
            {label: 'label-2', value: 'val-2'}
          ]},
          {type: 'toggle', appKey: 'test3'}
        ],
        false,
        {
          test1: 'val-1' // set one of the values via settings
        }
      );

      clayConfig.getItemByAppKey('test2').set('val-2');
      clayConfig.getItemByAppKey('test3').set(true);

      assert.deepEqual(clayConfig.getSettings(), {
        test1: 'val-1',
        test2: 'val-2',
        test3: true
      });
    });
  });

  describe('.registerComponent()', function() {
    it('adds the component to the registry', function(done) {
      delete componentRegistry.text;
      assert.typeOf(componentRegistry.text, 'undefined');
      var clayConfig = fixtures.clayConfig(['text'], true);

      clayConfig.on(clayConfig.EVENTS.BEFORE_BUILD, function() {
        clayConfig.registerComponent(textComponent);
      });

      clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function() {
        assert.strictEqual(this.getAllItems()[0].config.type, 'text');
        done();
      });

      clayConfig.build();
    });

    // @todo test for validation
  });

  describe('.build()', function() {
    it('dispatches the BEFORE_BUILD event at the right time', function(done) {
      var clayConfig = fixtures.clayConfig(['input', 'text', 'input'], true);
      clayConfig.on(clayConfig.EVENTS.BEFORE_BUILD, function() {

        // this should throw because the config has not been built yet
        assert.throws(clayConfig.getAllItems);
        done();
      });
      clayConfig.build();
    });

    it('dispatches the AFTER_BUILD event at the right time', function(done) {
      var clayConfig = fixtures.clayConfig(['input', 'text', 'input'], true);
      clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function() {

        // this should not throw because the config has been built
        assert.doesNotThrow(clayConfig.getAllItems);
        done();
      });
      clayConfig.build();
    });
  });
});
