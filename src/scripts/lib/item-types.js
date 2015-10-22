'use strict';

var manipulators = require('./manipulators');

module.exports = {
  heading: {
    template: require('../../templates/components/heading.mustache'),
    manipulator: manipulators.html
  },
  subheading: {
    template: require('../../templates/components/subheading.mustache'),
    manipulator: manipulators.html
  },
  footer: {
    template: require('../../templates/components/footer.mustache'),
    manipulator: manipulators.html
  },
  input: {
    template: require('../../templates/components/input.mustache'),
    manipulator: manipulators.val
  },
  color: {
    template: require('../../templates/components/color.mustache'),
    manipulator: manipulators.val
  },
  select: {
    template: require('../../templates/components/select.mustache'),
    manipulator: manipulators.val
  },
  toggle: {
    template: require('../../templates/components/toggle.mustache'),
    manipulator: manipulators.checked
  },
  submit: {
    template: require('../../templates/components/submit.mustache'),
    manipulator: manipulators.val
  }
};
