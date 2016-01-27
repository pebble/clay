'use strict';

module.exports = {
  template: require('../../../templates/items/select.tpl'),
  manipulator: require('../manipulators').val,
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
