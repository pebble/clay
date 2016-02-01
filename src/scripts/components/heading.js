'use strict';

module.exports = {
  name: 'heading',
  template: require('../../templates/items/heading.tpl'),
  manipulator: require('../lib/manipulators').html,
  defaults: {
    attributes: {},
    size: 4
  }
};
