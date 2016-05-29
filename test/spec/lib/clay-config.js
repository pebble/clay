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
      'serialize',
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
      'serialize'
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

  describe('.serialize()', function() {
    it('returns the correct settings', function() {
      var config = [
        {type: 'input', appKey: 'test1', defaultValue: 'default val'},
        {type: 'select', appKey: 'test2', options: [
          {label: 'label-1', value: 'val-1'},
          {label: 'label-2', value: 'val-2'}
        ]},
        {type: 'toggle', appKey: 'test3'},
        {type: 'checkboxgroup', appKey: 'test4', options: [
          {label: 'label-1', value: 'cb-1'},
          {label: 'label-2', value: 'cb-2'},
          {label: 'label-2', value: 'cb-3'}
        ]},
        {type: 'slider', appKey: 'test5', step: 0.05, defaultValue: 12.5}
      ];
      var settings = {
        test2: 'val-2'
      };

      var clayConfig = fixtures.clayConfig(config, true, true, settings);

      assert.deepEqual(clayConfig.serialize(), {
        test1: {value: 'default val'},
        test2: {value: 'val-2'},
        test3: {value: false},
        test4: {value: []},
        test5: {value: 12.5, precision: 2}
      });

      clayConfig.getItemByAppKey('test1').set('val-1');
      clayConfig.getItemByAppKey('test3').set(true);
      clayConfig.getItemByAppKey('test4').set(['cb-1', 'cb-3']);

      assert.deepEqual(clayConfig.serialize(), {
        test1: {value: 'val-1'},
        test2: {value: 'val-2'},
        test3: {value: true},
        test4: {value: ['cb-1', 'cb-3']},
        test5: {value: 12.5, precision: 2}
      });

      // make sure the result of serialize() can actually be fed back in to
      // a new instance of ClayConfig
      var clay = fixtures.clay(config);
      var response = encodeURIComponent(JSON.stringify(clayConfig.serialize()));
      clay.getSettings(response);
      var loadedSettings = JSON.parse(localStorage.getItem('clay-settings'));

      assert.deepEqual(loadedSettings, {
        test1: 'val-1',
        test2: 'val-2',
        test3: true,
        test4: ['cb-1', 'cb-3'],
        test5: 12.5
      });
      assert.doesNotThrow(function() {
        fixtures.clayConfig(config, true, true, loadedSettings);
      });
    });

    it('only returns the settings present in the config', function() {
      var config = [
        {type: 'input', appKey: 'test1', defaultValue: 'default val'},
        {type: 'select', appKey: 'test2', options: [
          {label: 'label-1', value: 'val-1'},
          {label: 'label-2', value: 'val-2'}
        ]}
      ];
      var settings = {
        test2: 'val-2',
        notInTheConfig: 'Should not exist'
      };

      var clayConfig = fixtures.clayConfig(config, true, true, settings);
      assert.deepEqual(clayConfig.serialize(), {
        test1: {value: 'default val'},
        test2: {value: 'val-2'}
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

  describe('.destroy().', function() {
    it('Destroys all the items on the page and in the items array', function() {
      var clayConfig = fixtures.clayConfig(['input', 'text', 'input'], false);

      clayConfig.build();
      clayConfig.destroy();

      // this should throw because the config has not been built yet
      assert.throws(clayConfig.getAllItems);

      // there should be no DOM inside the container
      assert.strictEqual(clayConfig.$rootContainer[0].children.length, 0);
    });

    it('dispatches the BEFORE_DESTROY event at the right time', function(done) {
      var clayConfig = fixtures.clayConfig(['input', 'text', 'input'], false);

      clayConfig.on(clayConfig.EVENTS.BEFORE_DESTROY, function() {
        assert.strictEqual(clayConfig.getAllItems().length, 3);
        done();
      });

      clayConfig.build();
      clayConfig.destroy();

      assert.strictEqual(clayConfig.getAllItems().length, 0);
    });

    it('dispatches the AFTER_DESTROY event at the right time', function(done) {
      var clayConfig = fixtures.clayConfig(['input', 'text', 'input'], false);

      clayConfig.on(clayConfig.EVENTS.AFTER_DESTROY, function() {

        // this should throw because the config has not been built yet
        assert.throws(clayConfig.getAllItems);
        done();
      });

      clayConfig.build();
      assert.strictEqual(clayConfig.getAllItems().length, 3);
      clayConfig.destroy();
    });
  });

  describe('.build()', function() {
    it('Destroys the config if called a consecutive time', function() {
      var clayConfig = fixtures.clayConfig(['input', 'text', 'input'], false);
      var destroyHandlerSpy = sinon.spy();

      clayConfig.on(clayConfig.EVENTS.AFTER_DESTROY, destroyHandlerSpy);

      clayConfig.build();
      assert.strictEqual(clayConfig.getAllItems().length, 3);

      clayConfig.config = fixtures.config(['select']);
      clayConfig.build();
      assert.strictEqual(clayConfig.getAllItems().length, 1);
      assert(destroyHandlerSpy.calledOnce);

      clayConfig.build();
      assert(destroyHandlerSpy.calledTwice);
    });

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
