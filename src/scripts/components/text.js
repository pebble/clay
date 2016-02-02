'use strict';

module.exports = {
  name: 'text',
  template: require('../../templates/components/text.tpl'),
  manipulator: require('../lib/manipulators').html,
  defaults: {
    attributes: {}
  }
};
