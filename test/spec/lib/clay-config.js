'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var _ = require('../../../src/scripts/vendor/minified')._;
var selectComponent = require('../../../src/scripts/components/select');
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
      'trigger',
      'meta'
    ];
    var clayConfig = fixtures.clayConfig(['input']);
    checkReadOnly(clayConfig, properties);
  });

  describe('.meta', function() {
    it('populates meta', function() {
      var clayConfig = fixtures.clayConfig(['input']);
      assert.deepEqual(clayConfig.meta, fixtures.meta());
    });
  });

  describe('throws when trying to run methods before being built', function() {
    [
      'getItemByAppKey',
      'getItemById',
      'getItemsByType',
      'getSettings'
    ].forEach(function(method) {
      it('.' + method + '()', function() {
        var clayConfig = fixtures.clayConfig(['input', 'text'], false);
        assert.throws(clayConfig[method], new RegExp(method));
      });
    });
  });

  describe('.getAllItems()', function() {
    it('returns an array of all the items', function() {
      var config = fixtures.config([
        {type: 'input', clayId: 0},
        {type: 'text', clayId: 1},
        [{type: 'input', clayId: 2}]
      ]);
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
        {type: 'input', appKey: 'test-app-key', clayId: 0},
        {type: 'input', appKey: undefined, clayId: 1}
      ]);
      var clayConfig = fixtures.clayConfig(config);
      assert.deepEqual(clayConfig.getItemByAppKey('test-app-key').config, config[0]);
    });
  });

  describe('.getItemById()', function() {
    it('it returns the correct item', function() {
      var config = fixtures.config([
        {type: 'input', id: 'test-id', clayId: 0},
        {type: 'input', id: undefined, clayId: 1}
      ]);
      var clayConfig = fixtures.clayConfig(config);
      assert.deepEqual(clayConfig.getItemById('test-id').config, config[0]);
    });
  });

  describe('.getItemsByType()', function() {
    it('it returns the correct items', function() {
      var config = fixtures.config([
        {type: 'input', clayId: 0},
        {type: 'text', clayId: 1},
        {type: 'input', clayId: 2}
      ]);
      var clayConfig = fixtures.clayConfig(config);
      assert.deepEqual(clayConfig.getItemsByType('input')[0].config, config[0]);
      assert.deepEqual(clayConfig.getItemsByType('input')[1].config, config[2]);
    });
  });

  describe('.getSettings()', function() {
    it('returns the correct settings', function() {
      var clayConfig = fixtures.clayConfig(
        [
          {type: 'input', appKey: 'test1', defaultValue: 'default val'},
          {type: 'select', appKey: 'test2', options: [
            {label: 'label-1', value: 'val-1'},
            {label: 'label-2', value: 'val-2'}
          ]},
          {type: 'toggle', appKey: 'test3'}
        ],
        true,
        true,
        {
          test2: 'val-2' // set one of the values via settings
        }
      );

      assert.deepEqual(clayConfig.getSettings(), {
        test1: 'default val',
        test2: 'val-2',
        test3: 0
      });

      clayConfig.getItemByAppKey('test1').set('val-1');
      clayConfig.getItemByAppKey('test3').set(true);

      assert.deepEqual(clayConfig.getSettings(), {
        test1: 'val-1',
        test2: 'val-2',
        test3: 1
      });
    });
  });

  describe('.registerComponent()', function() {
    it('adds the component to the registry and adds the style to the HEAD',
    function(done) {
      delete componentRegistry.select;
      assert.typeOf(componentRegistry.select, 'undefined');
      var clayConfig = fixtures.clayConfig(['select'], false, false);

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
      delete componentRegistry.select;
      var clayConfig = fixtures.clayConfig(['select'], false, false);
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
      delete componentRegistry.select;
      var clayConfig = fixtures.clayConfig(['select'], false, false);
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

    it('throws if there is no manipulator',
    function(done) {
      delete componentRegistry.select;
      var clayConfig = fixtures.clayConfig(['select'], false, false);
      var _selectComponent = _.copyObj(selectComponent);
      _selectComponent.manipulator = undefined;

      clayConfig.on(clayConfig.EVENTS.BEFORE_BUILD, function() {
        assert.throws(function() {
          clayConfig.registerComponent(_selectComponent);
        }, /manipulator must be defined/);
        done();
      });

      clayConfig.build();
    });

    it('only registers the component once', function() {
      delete componentRegistry.select;
      var warnStub = sinon.stub(console, 'warn');
      var clayConfig = fixtures.clayConfig(['select'], false, false);
      var _selectComponent1 = _.copyObj(selectComponent);
      var _selectComponent2 = _.copyObj(selectComponent);
      _selectComponent2.template = 'fake';

      assert.strictEqual(clayConfig.registerComponent(_selectComponent1), true);
      var styleCount = document.head.querySelectorAll('style').length;
      assert.strictEqual(clayConfig.registerComponent(_selectComponent2), false);

      // make sure the styles were not added twice
      assert.strictEqual(document.head.querySelectorAll('style').length, styleCount);

      // it should throw a warning
      assert.strictEqual(warnStub.callCount, 1, 'console.warn not called once');
      warnStub.restore();
    });
  });

  describe('.build()', function() {
    it('dispatches the BEFORE_BUILD event at the right time', function(done) {
      var clayConfig = fixtures.clayConfig(['input', 'text', 'input'], false);
      clayConfig.on(clayConfig.EVENTS.BEFORE_BUILD, function() {

        // this should throw because the config has not been built yet
        assert.throws(clayConfig.getAllItems);
        done();
      });
      clayConfig.build();
    });

    it('dispatches the AFTER_BUILD event at the right time', function(done) {
      var clayConfig = fixtures.clayConfig(['input', 'text', 'input'], false);
      clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function() {

        // this should not throw because the config has been built
        assert.doesNotThrow(clayConfig.getAllItems);
        done();
      });
      clayConfig.build();
    });
  });
});
