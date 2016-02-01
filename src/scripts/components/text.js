'use strict';

module.exports = {
  name: 'text',
  template: require('../../templates/items/text.tpl'),
  manipulator: require('../lib/manipulators').html,
  defaults: {
    attributes: {}
  }
};
