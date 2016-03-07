'use strict';

/**
 * @returns {ClayEvents}
 */
function disable() {
  this.$element.set('+disabled');
  this.$manipulatorTarget.set('disabled', true);
  return this.trigger('disabled');
}

/**
 * @returns {ClayEvents}
 */
function enable() {
  this.$element.set('-disabled');
  this.$manipulatorTarget.set('disabled', false);
  return this.trigger('enabled');
}

/**
 * @returns {ClayEvents}
 */
function hide() {
  this.$element.set('+hide');
  return this.trigger('hide');
}

/**
 * @returns {ClayEvents}
 */
function show() {
  this.$element.set('-hide');
  return this.trigger('show');
}

module.exports = {
  html: {
    get: function() {
      return this.$manipulatorTarget.get('innerHTML');
    },
    set: function(value) {
      this.$manipulatorTarget.set('innerHTML', value);
      return this.trigger('change');
    },
    hide: hide,
    show: show
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
    enable: enable,
    hide: hide,
    show: show
  },
  checked: {
    get: function() {
      return this.$manipulatorTarget.get('checked');
    },
    set: function(value) {
      this.$manipulatorTarget.set('checked', !!value);
      return this.trigger('change');
    },
    disable: disable,
    enable: enable,
    hide: hide,
    show: show
  },
  radiogroup: {
    get: function() {
      return this.$element.select('input:checked').get('value');
    },
    set: function(value) {
      this.$element
        .select('input[value="' + value.replace('"', '\\"') + '"]')
        .set('checked', true);
      return this.trigger('change');
    },
    disable: disable,
    enable: enable,
    hide: hide,
    show: show
  },
  checkboxgroup: {
    get: function() {
      var result = [];
      this.$element.select('input:checked').each(function(item) {
        result.push(item.value);
      });
      return result;
    },
    set: function(values) {
      var self = this;
      self.$element.select('input').set('checked', false);
      values = values || [];
      values.map(function(value) {
        self.$element
          .select('input[value="' + value.replace('"', '\\"') + '"]')
          .set('checked', true);
      });
      return self.trigger('change');
    },
    disable: disable,
    enable: enable,
    hide: hide,
    show: show
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
    enable: enable,
    hide: hide,
    show: show
  }
};
