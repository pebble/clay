'use strict';

module.exports = {
  name: 'footer',
  template: require('../../templates/components/footer.tpl'),
  manipulator: require('../lib/manipulators').html,
  defaults: {
    attributes: {}
  }
};
