'use strict';

var assert = require('chai').assert;
var fixture = require('../../fixture');

/**
 * @param {ClayItem} colorItem
 * @returns {void}
 */
function openPicker(colorItem) {
  colorItem.$element.select('label')[0].click();
}

describe('component - color', function() {
  it('shows the sunlit colors in the value display', function() {
    var clayConfig = fixture.clayConfig([
      {
        type: 'color',
        sunlight: true,
        id: '1',
        value: 'ff0000'
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
        value: 'ff0000'
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
});
