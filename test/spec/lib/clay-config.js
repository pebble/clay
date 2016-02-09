'use strict';

var assert = require('chai').assert;
var _ = require('../../../src/scripts/vendor/minified')._;
var selectComponent = require('pebble-clay-components').select;
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
    it('adds the component to the registry and adds the style to the HEAD',
    function(done) {
      delete componentRegistry.select;
      assert.typeOf(componentRegistry.select, 'undefined');
      var clayConfig = fixtures.clayConfig(['select'], true);

      clayConfig.on(clayConfig.EVENTS.BEFORE_BUILD, function() {
        clayConfig.registerComponent(selectComponent);
        assert.strictEqual(componentRegistry.select.name, selectComponent.name);
        assert.include(document.head.innerHTML, selectComponent.style);
      });

      clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function() {
        assert.strictEqual(this.getAllItems()[0].config.type, 'select');
        done();
      });

      clayConfig.build();
    });

    it('throws if manipulator is a string and does not match built-in manipulator',
    function(done) {
      var clayConfig = fixtures.clayConfig(['select'], true);
      var _textComponent = _.copyObj(selectComponent);
      _textComponent.manipulator = 'not_real';

      clayConfig.on(clayConfig.EVENTS.BEFORE_BUILD, function() {
        assert.throws(function() {
          clayConfig.registerComponent(_textComponent);
        }, new RegExp('not_real'));
        done();
      });

      clayConfig.build();
    });

    it('throws if manipulator does not have a `get` and `set` method',
    function(done) {
      var clayConfig = fixtures.clayConfig(['select'], true);
      var _selectComponent = _.copyObj(selectComponent);
      _selectComponent.manipulator = {};

      clayConfig.on(clayConfig.EVENTS.BEFORE_BUILD, function() {
        assert.throws(function() {
          clayConfig.registerComponent(_selectComponent);
        }, /(get.*set)|(set.*get)/);
        done();
      });

      clayConfig.build();
    });
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
