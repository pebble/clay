'use strict';

var assert = require('chai').assert;
var fixture = require('../../fixture');

describe('component - color', function() {
  it('sets the value display to the correct value on change', function() {
    var clayConfig = fixture.clayConfig([
      {
        type: 'select',
        defaultValue: 'value-1',
        options: [
          { label: 'label 1', value: 'value-1' },
          { label: 'label 2', value: 'value-2' }
        ]
      }
    ]);
    var selectItem = clayConfig.getItemsByType('select')[0];
    var $valueDisplay = selectItem.$element.select('.value');
    assert.strictEqual($valueDisplay.get('innerHTML'), 'label 1');
    selectItem.set('value-2');
    assert.strictEqual($valueDisplay.get('innerHTML'), 'label 2');
  });
});
