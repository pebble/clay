'use strict';

module.exports = {
  html: {
    get: function() {
      return this.$manipulatorTarget.html();
    },
    set: function(value) {
      return this.$manipulatorTarget.html(value)
        .triggerHandler('change');
    }
  },
  val: {
    get: function() {
      return this.$manipulatorTarget.val();
    },
    set: function(value) {
      return this.$manipulatorTarget.val(value)
        .triggerHandler('change');
    },
    disable: function() {
      return this.$manipulatorTarget.prop('disabled', true)
        .triggerHandler('change');
    },
    enable: function() {
      return this.$manipulatorTarget.prop('disabled', false)
        .triggerHandler('change');
    }
  },
  checked: {
    get: function() {
      return this.$manipulatorTarget.prop('checked');
    },
    set: function(value) {
      return this.$manipulatorTarget.prop('checked', value)
        .triggerHandler('change');
    },
    disable: function() {
      return this.$manipulatorTarget.prop('disabled', true)
        .triggerHandler('change');
    },
    enable: function() {
      return this.$manipulatorTarget.prop('disabled', false)
        .triggerHandler('change');
    }
  }
};
