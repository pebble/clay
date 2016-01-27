'use strict';

module.exports = {
  html: {
    get: function() {
      return this.$manipulatorTarget.get('innerHTML');
    },
    set: function(value) {
      return this.$manipulatorTarget.set('innerHTML', value)
        .trigger('change');
    }
  },
  val: {
    get: function() {
      return this.$manipulatorTarget.get('value');
    },
    set: function(value) {
      return this.$manipulatorTarget.set('value', value)
        .trigger('change');
    },
    disable: function() {
      return this.$manipulatorTarget.set('disabled', true)
        .trigger('disabled');
    },
    enable: function() {
      return this.$manipulatorTarget.set('disabled', false)
        .trigger('enabled');
    }
  },
  checked: {
    get: function() {
      return this.$manipulatorTarget.get('checked');
    },
    set: function(value) {
      return this.$manipulatorTarget.set('checked', value)
        .trigger('change');
    },
    disable: function() {
      return this.$manipulatorTarget.set('disabled', true)
        .trigger('change');
    },
    enable: function() {
      return this.$manipulatorTarget.set('disabled', false)
        .trigger('change');
    }
  },
  radiogroup: {
    get: function() {
      return this.$manipulatorTarget.find('input:checked').val();
    },
    set: function(value) {
      this.$manipulatorTarget.find('[value="' + value + '"]')
        .prop('checked', true);
      return this.$manipulatorTarget.trigger('change');
    },
    disable: function() {
      return this.$manipulatorTarget.set('disabled', true)
        .trigger('change');
    },
    enable: function() {
      return this.$manipulatorTarget.set('disabled', false)
        .trigger('change');
    }
  }
};
