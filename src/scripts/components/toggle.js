'use strict';

module.exports = {
  name: 'toggle',
  template: require('../../templates/items/toggle.tpl'),
  manipulator: require('../lib/manipulators').checked,
  defaults: {
    attributes: {}
  }
};
