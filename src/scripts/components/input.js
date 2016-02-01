'use strict';

module.exports = {
  name: 'input',
  template: require('../../templates/items/input.tpl'),
  manipulator: require('../lib/manipulators').val,
  defaults: {
    label: '',
    attributes: {}
  }
};
