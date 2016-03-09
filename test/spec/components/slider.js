'use strict';

var assert = require('chai').assert;
var fixture = require('../../fixture');

describe('component - select', function() {
  it('sets the value display to the correct value on set', function() {
    var clayConfig = fixture.clayConfig(['slider']);
    var sliderItem = clayConfig.getItemsByType('slider')[0];
    var $valueDisplay = sliderItem.$element.select('.value');
    var $valueDisplayPad = sliderItem.$element.select('.value-pad');

    assert.strictEqual($valueDisplay.get('value'), '50');
    assert.strictEqual($valueDisplayPad.get('innerHTML'), '50');
    sliderItem.set(75);
    assert.strictEqual($valueDisplay.get('value'), '75');
    assert.strictEqual($valueDisplayPad.get('innerHTML'), '75');
  });

  it('sets the value display to the correct value on slider change', function() {
    var clayConfig = fixture.clayConfig(['slider']);
    var sliderItem = clayConfig.getItemsByType('slider')[0];
    var $valueDisplay = sliderItem.$element.select('.value');
    var $valueDisplayPad = sliderItem.$element.select('.value-pad');
    var $slider = sliderItem.$element.select('.slider');

    assert.strictEqual($valueDisplay.get('value'), '50');
    assert.strictEqual($valueDisplayPad.get('innerHTML'), '50');
    $slider.set('value', 75).trigger('change');
    assert.strictEqual($valueDisplay.get('value'), '75');
    assert.strictEqual($valueDisplayPad.get('innerHTML'), '75');
  });

  it('sets the value-pqd to the same value as the user is typing', function() {
    var clayConfig = fixture.clayConfig(['slider']);
    var sliderItem = clayConfig.getItemsByType('slider')[0];
    var $valueDisplay = sliderItem.$element.select('.value');
    var $valueDisplayPad = sliderItem.$element.select('.value-pad');

    assert.strictEqual($valueDisplay.get('value'), '50');
    assert.strictEqual($valueDisplayPad.get('innerHTML'), '50');
    $valueDisplay.set('value', 75).trigger('keyup');
    assert.strictEqual($valueDisplay.get('value'), '75');
    assert.strictEqual($valueDisplayPad.get('innerHTML'), '75');
  });

  it('sets the slider to the correct value on user input', function() {
    var clayConfig = fixture.clayConfig(['slider']);
    var sliderItem = clayConfig.getItemsByType('slider')[0];
    var $valueDisplay = sliderItem.$element.select('.value');
    var $slider = sliderItem.$element.select('.slider');

    assert.strictEqual($valueDisplay.get('value'), '50');
    assert.strictEqual($slider.get('value'), '50');
    $valueDisplay.set('value', 75).trigger('change');
    assert.strictEqual($slider.get('value'), '75');
  });
});
