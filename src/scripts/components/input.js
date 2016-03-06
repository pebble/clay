'use strict';

module.exports = {
  name: 'input',
  template: require('../../templates/components/input.tpl'),
  style: require('../../styles/clay/components/input.scss'),
  manipulator: 'val',
  defaults: {
    label: '',
    description: '',
    attributes: {}
  }
};
