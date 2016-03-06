'use strict';

module.exports = {
  name: 'toggle',
  template: require('../../templates/components/toggle.tpl'),
  style: require('../../styles/clay/components/toggle.scss'),
  manipulator: 'checked',
  defaults: {
    label: '',
    description: '',
    attributes: {}
  }
};
