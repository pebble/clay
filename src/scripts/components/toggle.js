'use strict';

module.exports = {
  name: 'toggle',
  template: require('../../templates/components/toggle.tpl'),
  manipulator: require('../lib/manipulators').checked,
  defaults: {
    attributes: {}
  }
};
