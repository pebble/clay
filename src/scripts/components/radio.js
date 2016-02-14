'use strict';

module.exports = {
  name: 'radio',
  template: require('../../templates/components/radio.tpl'),
  style: require('../../styles/clay/components/radio.scss'),
  manipulator: 'radio',
  defaults: {
    label: '',
    options: [],
  }
};
