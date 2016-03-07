'use strict';

module.exports = {
  name: 'button',
  template: require('../../templates/components/button.tpl'),
  style: require('../../styles/clay/components/button.scss'),
  manipulator: 'button',
  defaults: {
    primary: false,
    attributes: {},
    description: ''
  }
};
