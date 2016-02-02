'use strict';

module.exports = {
  name: 'heading',
  template: require('../../templates/components/heading.tpl'),
  manipulator: require('../lib/manipulators').html,
  defaults: {
    attributes: {},
    size: 4
  }
};
