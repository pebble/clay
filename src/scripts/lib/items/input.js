'use strict';

module.exports = {
  template: require('../../../templates/items/input.tpl'),
  manipulator: require('../manipulators').val,
  defaults: {
    label: '',
    attributes: {}
  }
};
