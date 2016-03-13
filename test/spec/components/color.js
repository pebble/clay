'use strict';

var assert = require('chai').assert;
var fixture = require('../../fixture');

var sunlightColorMap = {
  '000000': '000000', '000055': '001e41', '0000aa': '004387', '0000ff': '0068ca',
  '005500': '2b4a2c', '005555': '27514f', '0055aa': '16638d', '0055ff': '007dce',
  '00aa00': '5e9860', '00aa55': '5c9b72', '00aaaa': '57a5a2', '00aaff': '4cb4db',
  '00ff00': '8ee391', '00ff55': '8ee69e', '00ffaa': '8aebc0', '00ffff': '84f5f1',
  '550000': '4a161b', '550055': '482748', '5500aa': '40488a', '5500ff': '2f6bcc',
  '555500': '564e36', '555555': '545454', '5555aa': '4f6790', '5555ff': '4180d0',
  '55aa00': '759a64', '55aa55': '759d76', '55aaaa': '71a6a4', '55aaff': '69b5dd',
  '55ff00': '9ee594', '55ff55': '9de7a0', '55ffaa': '9becc2', '55ffff': '95f6f2',
  'aa0000': '99353f', 'aa0055': '983e5a', 'aa00aa': '955694', 'aa00ff': '8f74d2',
  'aa5500': '9d5b4d', 'aa5555': '9d6064', 'aa55aa': '9a7099', 'aa55ff': '9587d5',
  'aaaa00': 'afa072', 'aaaa55': 'aea382', 'aaaaaa': 'ababab', 'ffffff': 'ffffff',
  'aaaaff': 'a7bae2', 'aaff00': 'c9e89d', 'aaff55': 'c9eaa7', 'aaffaa': 'c7f0c8',
  'aaffff': 'c3f9f7', 'ff0000': 'e35462', 'ff0055': 'e25874', 'ff00aa': 'e16aa3',
  'ff00ff': 'de83dc', 'ff5500': 'e66e6b', 'ff5555': 'e6727c', 'ff55aa': 'e37fa7',
  'ff55ff': 'e194df', 'ffaa00': 'f1aa86', 'ffaa55': 'f1ad93', 'ffaaaa': 'efb5b8',
  'ffaaff': 'ecc3eb', 'ffff00': 'ffeeab', 'ffff55': 'fff1b5', 'ffffaa': 'fff6d3'
};

/* eslint-disable  comma-spacing, no-multi-spaces, max-len,
 standard/array-bracket-even-spacing */
var standardLayouts = {
  COLOR: [
    [false   , false   , '55ff00', 'aaff55', false   , 'ffff55', 'ffffaa', false   , false   ],
    [false   , 'aaffaa', '55ff55', '00ff00', 'aaff00', 'ffff00', 'ffaa55', 'ffaaaa', false   ],
    ['55ffaa', '00ff55', '00aa00', '55aa00', 'aaaa55', 'aaaa00', 'ffaa00', 'ff5500', 'ff5555'],
    ['aaffff', '00ffaa', '00aa55', '55aa55', '005500', '555500', 'aa5500', 'ff0000', 'ff0055'],
    [false   , '55aaaa', '00aaaa', '005555', 'ffffff', '000000', 'aa5555', 'aa0000', false   ],
    ['55ffff', '00ffff', '00aaff', '0055aa', 'aaaaaa', '555555', '550000', 'aa0055', 'ff55aa'],
    ['55aaff', '0055ff', '0000ff', '0000aa', '000055', '550055', 'aa00aa', 'ff00aa', 'ffaaff'],
    [false   , '5555aa', '5555ff', '5500ff', '5500aa', 'aa00ff', 'ff00ff', 'ff55ff', false   ],
    [false   , false   , false   , 'aaaaff', 'aa55ff', 'aa55aa', false   , false   , false   ]
  ],
  GRAY: [
    ['000000', 'aaaaaa', 'ffffff']
  ],
  BLACK_WHITE: [
    ['000000', 'ffffff']
  ]
};
/* eslint-enable */

/**
 * @param {ClayItem} colorItem
 * @returns {void}
 */
function openPicker(colorItem) {
  colorItem.$element.select('label')[0].click();
}

/**
 * @param {string} hex
 * @returns {string} - eg: "rgb(1, 2, 3)"
 */
function hexToRgb(hex) {
  var result = /^(?:#|0x)?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ?
    'rgb(' +
      parseInt(result[1], 16) + ', ' +
      parseInt(result[2], 16) + ', ' +
      parseInt(result[3], 16) + ')' :
    hex;
}

/**
 * @param {number|string} value
 * @returns {string}
 */
function normalizeColor(value) {
  switch (typeof value) {
    case 'number': value = value.toString(16); break;
    case 'string': value = value.replace(/^#|^0x/, ''); break;
  }
  return value || '000000';
}

/**
 * @param {Array.<Array>} layout
 * @returns {Array}
 */
function flattenLayout(layout) {
  return layout.reduce(function(a, b) {
    return a.concat(b);
  }, []);
}

/**
 * @param {Array|string} [layout=color]
 * @param {Array} [expectedColors]
 * @return {void}
 */
function testCustomLayout(layout, expectedColors) {

  describe('layout: ' + JSON.stringify(layout || 'default'), function() {

    describe('Normal', function() {
      testColors(false, layout, expectedColors);
    });

    describe('Sunlight', function() {
      testColors(true, layout, expectedColors);
    });
  });
}

/**
 * @param {string} platform
 * @param {Array} layout
 * @param {string} [desc]
 * @param {Object} activeWatchInfo
 * @return {void}
 */
function testAutoLayout(platform, layout, desc, activeWatchInfo) {
  it('chooses the best layout for the ' + (desc || platform) + ' platform',
  function() {
    var clayConfig = fixture.clayConfig(['color'], true, true, {}, {
      activeWatchInfo: activeWatchInfo
    });
    var colorItem = clayConfig.getItemsByType('color')[0];
    assert.deepEqual(colorItem._layout, layout);
  });
}

/**
 * @param {boolean} sunlight
 * @param {Array|string} [layout=color]
 * @param {Array} [expectedColors]
 * @return {void}
 */
function testColors(sunlight, layout, expectedColors) {
  var clayConfig;
  var colorItem;
  var $colorBoxes;
  var colors;

  beforeEach(function() {
    clayConfig = fixture.clayConfig([
      {
        type: 'color',
        layout: layout,
        sunlight: sunlight
      }
    ]);
    colorItem = clayConfig.getItemsByType('color')[0];

    layout = layout || 'COLOR';
    if (typeof layout === 'string') {
      layout = standardLayouts[layout];
    }

    colors = expectedColors || flattenLayout(layout);
    $colorBoxes = colorItem.$element.select('.color-box');
  });

  it('Has the correct items in the layout', function() {
    colors.forEach(function(color, index) {
      if (color === false) {
        assert.strictEqual($colorBoxes[index].dataset.value, undefined);
      } else {
        assert.strictEqual(
          parseInt($colorBoxes[index].dataset.value, 10),
          parseInt(color || 0, 16)
        );
      }
    });
  });

  it('sets the color correctly', function() {
    colors.forEach(function(color, index) {
      if (color === false) {
        assert.strictEqual(
          $colorBoxes[index].style.backgroundColor,
          'transparent'
        );
      } else {
        var normalizedColor = normalizeColor(color);
        assert.strictEqual(
          $colorBoxes[index].style.backgroundColor,
          hexToRgb(sunlight ? sunlightColorMap[normalizedColor] : normalizedColor)
        );
      }
    });
  });
}

describe('component - color', function() {
  it('shows the sunlit colors in the value display', function() {
    var clayConfig = fixture.clayConfig([
      {
        type: 'color',
        sunlight: true,
        id: '1',
        defaultValue: 'ff0000'
      }
    ]);
    var colorItem = clayConfig.getItemById('1');

    assert.strictEqual(colorItem.get(), 0xff0000);
    assert.strictEqual(
      colorItem.$element.select('.value')[0].style.backgroundColor,
      'rgb(227, 84, 98)'
    );
    colorItem.set('0000FF');
    assert.strictEqual(
      colorItem.$element.select('.value')[0].style.backgroundColor,
      'rgb(0, 104, 202)'
    );
  });

  it('shows the normal colors in the value display', function() {
    var clayConfig = fixture.clayConfig([
      {
        type: 'color',
        sunlight: false,
        id: '1',
        defaultValue: 'ff0000'
      }
    ]);
    var colorItem = clayConfig.getItemById('1');

    assert.strictEqual(colorItem.get(), 0xff0000);
    assert.strictEqual(
      colorItem.$element.select('.value')[0].style.backgroundColor,
      'rgb(255, 0, 0)'
    );
    colorItem.set('0000FF');
    assert.strictEqual(
      colorItem.$element.select('.value')[0].style.backgroundColor,
      'rgb(0, 0, 255)'
    );
  });

  it('shows the picker when the label is clicked', function() {
    var clayConfig = fixture.clayConfig(['color']);
    var colorItem = clayConfig.getItemsByType('color')[0];
    var $picker = colorItem.$element.select('.picker-wrap');
    assert.strictEqual($picker.get('classList').contains('show'), false);
    openPicker(colorItem);
    assert.strictEqual($picker.get('classList').contains('show'), true);
  });

  it('only shows the picker if the item is enabled', function() {
    var clayConfig = fixture.clayConfig(['color']);
    var colorItem = clayConfig.getItemsByType('color')[0];
    var $picker = colorItem.$element.select('.picker-wrap');
    colorItem.disable();
    assert.strictEqual($picker.get('classList').contains('show'), false);
    openPicker(colorItem);
    assert.strictEqual($picker.get('classList').contains('show'), false);
    colorItem.enable();
    openPicker(colorItem);
    assert.strictEqual($picker.get('classList').contains('show'), true);
  });

  it('sets the value and closes picker when the user makes a selection', function() {
    var clayConfig = fixture.clayConfig([{type: 'color', sunlight: false}]);
    var colorItem = clayConfig.getItemsByType('color')[0];
    var $picker = colorItem.$element.select('.picker-wrap');
    assert.strictEqual(colorItem.get(), 0x000000);
    openPicker(colorItem);
    colorItem.$element.select('[data-value="16711680"]')[0].click();
    assert.strictEqual(colorItem.get(), 0xff0000);
    assert.strictEqual(
      colorItem.$element.select('.value')[0].style.backgroundColor,
      'rgb(255, 0, 0)'
    );
    assert.strictEqual($picker.get('classList').contains('show'), false);
  });

  it('closes the picker if a user clicks the background', function() {
    var clayConfig = fixture.clayConfig([{type: 'color', sunlight: false}]);
    var colorItem = clayConfig.getItemsByType('color')[0];
    var $picker = colorItem.$element.select('.picker-wrap');
    assert.strictEqual(colorItem.get(), 0x000000);
    openPicker(colorItem);
    assert.strictEqual($picker.get('classList').contains('show'), true);
    $picker[0].click();
    assert.strictEqual($picker.get('classList').contains('show'), false);
  });

  describe('layouts', function() {

    testAutoLayout('aplite', standardLayouts.BLACK_WHITE, 'aplite (2.x)', null);
    testAutoLayout('aplite', standardLayouts.BLACK_WHITE, 'aplite (2.x)', {
      platform: 'aplite',
      model: 'qemu_platform_aplite',
      language: 'en_US',
      firmware: {
        major: 2,
        minor: 10,
        patch: 0,
        suffix: ''
      }
    });
    testAutoLayout('aplite', standardLayouts.GRAY, 'aplite (3.x)', {
      platform: 'aplite',
      model: 'qemu_platform_aplite',
      language: 'en_US',
      firmware: {
        major: 3,
        minor: 10,
        patch: 0,
        suffix: ''
      }
    });
    testAutoLayout('basalt', standardLayouts.COLOR, '', {
      platform: 'basalt',
      model: 'qemu_platform_basalt',
      language: 'en_US',
      firmware: {
        major: 3,
        minor: 10,
        patch: 0,
        suffix: ''
      }
    });
    testAutoLayout('chalk', standardLayouts.COLOR, '', {
      platform: 'chalk',
      model: 'qemu_platform_chalk',
      language: 'en_US',
      firmware: {
        major: 3,
        minor: 10,
        patch: 0,
        suffix: ''
      }
    });

    testCustomLayout();
    testCustomLayout('COLOR');
    testCustomLayout('GRAY');
    testCustomLayout('BLACK_WHITE');
    testCustomLayout(['aaffaa', '55ff55', '00ff00']);
    testCustomLayout([false, '55ff55', '00ff00']);
    testCustomLayout([['aaffaa', '55ff55', '00ff00']]);
    testCustomLayout(
      [['AAFFAA', '#55ff55', '0x00ff00', 0xff5500, null]],
      ['aaffaa', '55ff55', '00ff00', 'ff5500', false]
    );
    testCustomLayout([
      ['aaffaa', '55ff55', '00ff00'],
      ['005555', 'ffffff', '000000']]
    );
    testCustomLayout([
      ['aaffaa', '55ff55', '00ff00'],
      [false, 'ffffff', false]]
    );
    testCustomLayout(
      [
        ['aaffaa', '55ff55', '00ff00'],
        [false, 'ffffff']
      ],
      ['aaffaa', '55ff55', '00ff00', false, 'ffffff', false]
    );
    testCustomLayout(
      [
        ['aaffaa', '55ff55', false],
        [false, 'ffffff']
      ],
      ['aaffaa', '55ff55', false, false, 'ffffff', false]
    );
    testCustomLayout(
      [
        ['aaffaa', '55ff55'],
        [false, 'ffffff', '000000']
      ],
      ['aaffaa', '55ff55', false, false, 'ffffff', '000000']
    );

  });
});
