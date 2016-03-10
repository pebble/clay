'use strict';

module.exports = {
  name: 'slider',
  template: require('../../templates/components/slider.tpl'),
  style: require('../../styles/clay/components/slider.scss'),
  manipulator: 'slider',
  defaults: {
    label: '',
    description: '',
    min: 0,
    max: 100,
    step: 1,
    attributes: {}
  },
  initialize: function() {
    var self = this;

    var $value = self.$element.select('.value');
    var $valuePad = self.$element.select('.value-pad');

    /**
     * Sets the value display
     * @return {void}
     */
    function setValueDisplay() {
      var value = self.get();
      $value.set('value', value);
      $valuePad.set('innerHTML', value);
    }

    var step = self.$manipulatorTarget.get('step');
    step = step.toString(10).split('.')[1];
    self.precision = step ? step.length : 0;

    self.on('change', setValueDisplay);
    setValueDisplay();

    $value.on('|keyup', function() {
      $valuePad.set('innerHTML', this.get('value'));
    });

    $value.on('|change', function() {
      self.set(this.get('value'));
      setValueDisplay();
    });
  }
};
