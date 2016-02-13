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
      this.$manipulatorTarget.set('value', value);
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
      this.$manipulatorTarget.set('checked', value);
      return this.trigger('change');
    },
    disable: disable,
    enable: enable
  },
  color: {
    get: function() {
      return parseInt(this.$manipulatorTarget.get('value'), 16);
    },
    set: function(value) {
      switch (typeof value) {
        case 'number': value = value.toString(16); break;
        case 'string': value = value.replace(/^#|^0x/, ''); break;
      }

      this.$manipulatorTarget.set('value', value || '000000');
      return this.trigger('change');
    },
    disable: disable,
    enable: enable
  }
};
