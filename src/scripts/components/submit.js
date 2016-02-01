'use strict';

module.exports = {
  name: 'submit',
  template: require('../../templates/items/submit.tpl'),
  manipulator: require('../lib/manipulators').val,
  defaults: {
    attributes: {}
  }
};
