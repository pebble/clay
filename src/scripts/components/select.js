'use strict';

module.exports = {
  name: 'select',
  template: require('../../templates/components/select.tpl'),
  style: require('../../styles/clay/components/select.scss'),
  manipulator: 'val',
  defaults: {
    label: '',
    options: [],
    attributes: {}
  },
  initialize: function() {
    var self = this;

    var $value = self.$element.select('.value');

    self.on('change', function() {
      var selectedIndex = self.$manipulatorTarget.get('selectedIndex');
      var $options = self.$manipulatorTarget.select('option');
      var value = $options[selectedIndex] && $options[selectedIndex].innerHTML;
      $value.set('innerHTML', value);
    });
  }
};
