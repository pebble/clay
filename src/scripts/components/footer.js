'use strict';

module.exports = {
  name: 'footer',
  template: require('../../templates/items/footer.tpl'),
  manipulator: require('../lib/manipulators').html,
  defaults: {
    attributes: {}
  }
};
