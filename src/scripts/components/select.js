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

    self.on('change', function(ev) {
      var value = self.$manipulatorTarget.select('option:checked').get('innerHTML');
      $value.set('innerHTML', value);
    });
  }
};
