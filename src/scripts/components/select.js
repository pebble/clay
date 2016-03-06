'use strict';

module.exports = {
  name: 'select',
  template: require('../../templates/components/select.tpl'),
  style: require('../../styles/clay/components/select.scss'),
  manipulator: 'val',
  defaults: {
    label: '',
    options: [],
    description: '',
    attributes: {}
  },
  initialize: function() {
    var self = this;

    var $value = self.$element.select('.value');

    /**
     * Updates the HTML value of the component to match the slected option's label
     * @return {void}
     */
    function setValueDisplay() {
      var selectedIndex = self.$manipulatorTarget.get('selectedIndex');
      var $options = self.$manipulatorTarget.select('option');
      var value = $options[selectedIndex] && $options[selectedIndex].innerHTML;
      $value.set('innerHTML', value);
    }

    setValueDisplay();
    self.on('change', setValueDisplay);
  }
};
