'use strict';

module.exports = {
  name: 'submit',
  template: require('../../templates/components/submit.tpl'),
  manipulator: require('../lib/manipulators').val,
  defaults: {
    attributes: {}
  }
};
