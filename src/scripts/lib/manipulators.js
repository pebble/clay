'use strict';

/**
 * @returns {ClayEvents}
 */
function disable() {
  this.$manipulatorTarget.set('disabled', true);
  return this.trigger('disabled');
}

/**
 * @returns {ClayEvents}
 */
function enable() {
  this.$manipulatorTarget.set('disabled', false);
  return this.trigger('enabled');
}

module.exports = {
  html: {
    get: function() {
      return this.$manipulatorTarget.get('innerHTML');
    },
    set: function(value) {
      this.$manipulatorTarget.set('innerHTML', value);
      return this.trigger('change');
    }
  },
  val: {
    get: function() {
      return this.$manipulatorTarget.get('value');
    },
    set: function(value) {
      this.$manipulatorTarget.set('value', value)
      return this.trigger('change');
    },
    disable: disable,
    enable: enable
  },
  checked: {
    get: function() {
      return this.$manipulatorTarget.get('checked');
    },
    set: function(value) {
      this.$manipulatorTarget.set('checked', value)
      return this.trigger('change');
    },
    disable: disable,
    enable: enable
  }
};
