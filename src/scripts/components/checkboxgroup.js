'use strict';

module.exports = {
  name: 'checkboxgroup',
  template: require('../../templates/components/checkboxgroup.tpl'),
  style: require('../../styles/clay/components/checkboxgroup.scss'),
  manipulator: 'checkboxgroup',
  defaults: {
    label: '',
    options: [],
    description: ''
  }
};
