'use strict';

module.exports = {
  name: 'radiogroup',
  template: require('../../templates/components/radiogroup.tpl'),
  style: require('../../styles/clay/components/radiogroup.scss'),
  manipulator: 'radiogroup',
  defaults: {
    label: '',
    options: [],
    description: '',
    attributes: {}
  }
};
