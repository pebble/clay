'use strict';

module.exports = {
  name: 'select',
  template: require('../../templates/components/select.tpl'),
  manipulator: require('../lib/manipulators').val,
  defaults: {
    label: '',
    options: []
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
