'use strict';

var fixture = require('../fixture');
var Clay = require('../../index');
var assert = require('chai').assert;
var standardComponents = require('../../src/scripts/components');
var sinon = require('sinon');
var toSource = require('tosource');

var accountToken = '0123456789abcdef0123456789abcdef';
var watchToken = '0123456789abcdef0123456789abcdef';
var activeWatchInfo = {
  platform: 'chalk',
  model: 'qemu_platform_chalk',
  language: 'en_US',
  firmware: {
    major: 3,
    minor: 3,
    patch: 2,
    suffix: ''
  }
};

/**
 * @return {void}
 */
function stubPebble() {
  global.Pebble = {
    addEventListener: sinon.stub(),
    openURL: sinon.stub(),
    sendAppMessage: sinon.stub(),
    getActiveWatchInfo: sinon.stub().returns(activeWatchInfo),
    getAccountToken: sinon.stub().returns(accountToken),
    getWatchToken: sinon.stub().returns(watchToken)
  };
}

describe('Clay', function() {
  describe('Clay constructor', function() {
    it('throws if the config is not an array', function() {
      assert.throws(function() {
        fixture.clay({});
      }, /must be an Array/i);
    });

    it('throws if customFn is not a function', function() {
      assert.throws(function() {
        fixture.clay([], {});
      }, /must be a function/i);
    });

    it('does not throw if customFn is undefined or a function', function() {
      assert.doesNotThrow(function() {
        fixture.clay([], function() {});
      });

      assert.doesNotThrow(function() {
        fixture.clay([]).customFn();
      });
    });

    it('registers the standard components present in the config', function() {
      var config = fixture.config(
        ['input', 'input', 'select', 'custom', ['color']],
        false
      );
      var clay = fixture.clay(config);
      assert.deepEqual(clay.components, {
        input: standardComponents['input'],
        select: standardComponents['select'],
        color: standardComponents['color']
      });
    });

    it('handles the "showConfiguration" event if autoHandleEvents is not false',
    function() {
      this.timeout(10000); // 10 seconds

      stubPebble();
      var clay = fixture.clay([]);

      // we stub the generateUrl method to avoid very large string comparisons.
      var generateUrlStub = sinon.stub(clay, 'generateUrl');
      generateUrlStub.returns('data:text/html;base64,PGh0bWw%2BVEVTVDwvaHRtbD4%3D');
      Pebble.addEventListener.withArgs('showConfiguration').callArg(1);

      assert(Pebble.addEventListener.calledWith('showConfiguration'));
      assert(Pebble.openURL.calledWith(clay.generateUrl()));
      generateUrlStub.restore();
    });

    it('handles the "webviewclosed" event if autoHandleEvents is not false',
    function() {
      stubPebble();
      fixture.clay([]);
      var logStub = sinon.stub(console, 'log');
      Pebble.addEventListener
        .withArgs('webviewclosed')
        .callArgWith(1, { response: '%7B%22appKey%22%3A%22value%22%7D' });

      assert(Pebble.addEventListener.calledWith('webviewclosed'));
      assert(Pebble.sendAppMessage.calledWith({ appKey: 'value' }));

      Pebble.sendAppMessage.callArg(1);
      assert(logStub.calledWith('Sent config data to Pebble'));

      Pebble.sendAppMessage.callArgWith(2, {some: 'error'});
      assert(logStub.calledWith('Failed to send config data!'));
      assert(logStub.calledWith('{"some":"error"}'));

      logStub.restore();
    });

    it('handles an empty response in the "webviewclosed" handler', function() {
      stubPebble();
      fixture.clay([]);
      Pebble.addEventListener.withArgs('webviewclosed').callArgWith(1, undefined);

      assert(Pebble.addEventListener.calledWith('webviewclosed'));
      assert.strictEqual(Pebble.sendAppMessage.callCount, 0);
    });

    it('does not handle the "webviewclosed" or "showConfiguration" events ' +
       'if autoHandleEvents is false', function() {
      stubPebble();
      fixture.clay([], null, { autoHandleEvents: false });
      assert.strictEqual(
        Pebble.addEventListener.withArgs('webviewclosed').called,
        false
      );
      assert.strictEqual(
        Pebble.addEventListener.withArgs('showConfiguration').called,
        false
      );
    });
  });

  describe('.registerComponent()', function() {
    it('adds the component to the this.components', function() {
      var clay = fixture.clay([]);
      var customComponent = {
        name: 'custom',
        template: '<div></div>',
        manipulator: 'val'
      };
      clay.registerComponent(customComponent);
      assert.strictEqual(clay.components[customComponent.name], customComponent);
    });
  });

  describe('.generateUrl()', function() {

    /**
     * Decode the generated data URI into just the HTML portion
     * @param {string} url
     * @returns {string}
     */
    function decodeUrl(url) {
      return atob(decodeURIComponent(url.replace(/^.*?[#,]/, '')));
    }

    describe('string substitutions', function() {
      var customFn = function() { this.getAllItems(); };
      var config = fixture.config(['input', 'color']);
      var settings = { appKey: 'value' };
      var clay;
      var html;

      before(function() {
        stubPebble();
        clay = fixture.clay(config, customFn);
        Pebble.addEventListener.withArgs('showConfiguration').callArg(1);
        localStorage.setItem('clay-settings', JSON.stringify(settings));
        html = decodeUrl(clay.generateUrl());
      });

      it('Substitutes $$RETURN_TO$$ with the pebblejs://close#', function() {
        assert.notInclude(html, '$$RETURN_TO$$');
        assert.include(html, 'window.returnTo="pebblejs://close#"');
      });

      it('Substitutes $$CUSTOM_FN$$ with the customFn', function() {
        assert.notInclude(html, '$$CUSTOM_FN$$');
        assert.include(html, 'window.customFn=' + toSource(customFn));
      });

      it('Substitutes $$CONFIG$$ with the config', function() {
        assert.notInclude(html, '$$CONFIG$$');
        assert.include(html, 'window.clayConfig=' + toSource(config));
      });

      it('Substitutes $$SETTINGS$$ with the config', function() {
        assert.notInclude(html, '$$SETTINGS$$');
        assert.include(html, 'window.claySettings=' + toSource(settings));
      });

      it('Substitutes $$COMPONENTS$$ with the config', function() {
        assert.notInclude(html, '$$COMPONENTS$$');
        assert.include(html, 'window.clayComponents=' + toSource(clay.components));
      });

      it('Substitutes $$META$$ with the config', function() {
        assert.notInclude(html, '$$META$$');
        assert.include(html, 'window.clayMeta=' + toSource(clay.meta));
      });
    });

    it('does not replace $$RETURN_TO$$ if in the emulator', function() {
      var clay = fixture.clay([]);
      stubPebble();
      Pebble.platform = 'pypkjs';
      assert.match(decodeUrl(clay.generateUrl()), /\$\$RETURN_TO\$\$/);
    });

    it('returns the emulator URL if inside emulator', function() {
      var clay = fixture.clay([]);
      stubPebble();
      Pebble.platform = 'pypkjs';
      assert.match(
        clay.generateUrl(),
        /^http:\/\/clay\.pebble\.com\.s3-website-us-west-2\.amazonaws.com\/#/
      );
    });

    it('doesn\'t throw and logs an error if settings in localStorage are broken',
    function() {
      var clay = fixture.clay([]);
      var errorStub = sinon.stub(console, 'error');
      localStorage.setItem('clay-settings', 'not valid JSON');
      assert.doesNotThrow(function() {
        clay.generateUrl();
      });
      assert(errorStub.calledWithMatch(/SyntaxError/i));
      errorStub.restore();
    });
  });

  describe('.getSettings()', function() {
    it('stores the response to localStorage and returns the decoded data',
    function() {
      var clay = fixture.clay([]);
      var result = clay.getSettings('%7B%22appKey%22%3A%22value%22%7D');
      assert.equal(localStorage.getItem('clay-settings'), '{"appKey":"value"}');
      assert.deepEqual(result, {appKey: 'value'});
    });

    it('does not store the response if it is invalid JSON and logs an error',
    function() {
      var clay = fixture.clay([]);
      localStorage.setItem('clay-settings', '{"appKey":"value"}');

      assert.throws(function() {
        clay.getSettings('not valid JSON');
      }, /Not Valid JSON/i);
      assert.equal(localStorage.getItem('clay-settings'), '{"appKey":"value"}');
    });
  });

  describe('.meta', function() {
    var emptyMeta = {
      activeWatchInfo: null,
      accountToken: '',
      watchToken: ''
    };

    it('populates the meta in the showConfiguration handler', function() {
      stubPebble();
      var clay = fixture.clay([]);

      // meta only gets populated after showConfiguration happens
      assert.deepEqual(clay.meta, emptyMeta);
      Pebble.addEventListener.withArgs('showConfiguration').callArg(1);

      assert.deepEqual(clay.meta, {
        activeWatchInfo: activeWatchInfo,
        accountToken: accountToken,
        watchToken: watchToken
      });
    });

    it('populates the meta in the ready handler', function() {
      stubPebble();
      var clay = fixture.clay([], null, {autoHandleEvents: false});

      // meta only gets populated after ready happens
      assert.deepEqual(clay.meta, emptyMeta);
      Pebble.addEventListener.withArgs('ready').callArg(1);

      assert.deepEqual(clay.meta, {
        activeWatchInfo: activeWatchInfo,
        accountToken: accountToken,
        watchToken: watchToken
      });
    });

    it('populates the meta with with empty values when there is no Pebble global',
    function() {
      delete global.Pebble;
      var clay = fixture.clay([], null, {autoHandleEvents: false});

      assert.deepEqual(clay.meta, emptyMeta);
    });
  });

  describe('Clay.encodeDataUri()', function() {

    /**
     * @return {void}
     */
    function testEncodeDataUri() {
      it('adds the correct prefix', function() {
        assert.equal(Clay.encodeDataUri('test', 'prefix:'), 'prefix:dGVzdA%3D%3D');
        assert.equal(
          Clay.encodeDataUri('test'),
          'data:text/html;base64,dGVzdA%3D%3D'
        );
      });

      it('encodes the data correctly', function() {
        assert.equal(Clay.encodeDataUri('test', ''), 'dGVzdA%3D%3D');
        assert.equal(Clay.encodeDataUri('test{2}', ''), 'dGVzdHsyfQ%3D%3D');
        assert.equal(Clay.encodeDataUri('test{10}', ''), 'dGVzdHsxMH0%3D');
      });

      it('throws if the input is invalid', function() {
        assert.throws(function() {
          Clay.encodeDataUri('♥');
        });
      });
    }

    describe('native', function() {
      testEncodeDataUri();
    });

    describe('polyfill', function() {
      var btoaOriginal = window.btoa;

      before(function() {
        window.btoa = undefined;
      });

      testEncodeDataUri();

      after(function() {
        window.btoa = btoaOriginal;
      });
    });

  });
});
