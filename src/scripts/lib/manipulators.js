'use strict';

var _ = require('../vendor/minified')._;

/**
 * @returns {ClayItem|ClayEvents}
 * @extends {ClayItem}
 */
function disable() {
  if (this.$manipulatorTarget.get('disabled')) { return this; }
  this.$element.set('+disabled');
  this.$manipulatorTarget.set('disabled', true);
  return this.trigger('disabled');
}

/**
 * @returns {ClayItem|ClayEvents}
 * @extends {ClayItem}
 */
function enable() {
  if (!this.$manipulatorTarget.get('disabled')) { return this; }
  this.$element.set('-disabled');
  this.$manipulatorTarget.set('disabled', false);
  return this.trigger('enabled');
}

/**
 * @returns {ClayItem|ClayEvents}
 * @extends {ClayItem}
 */
function hide() {
  if (this.$element[0].classList.contains('hide')) { return this; }
  this.$element.set('+hide');
  return this.trigger('hide');
}

/**
 * @returns {ClayItem|ClayEvents}
 * @extends {ClayItem}
 */
function show() {
  if (!this.$element[0].classList.contains('hide')) { return this; }
  this.$element.set('-hide');
  return this.trigger('show');
}

module.exports = {
  html: {
    get: function() {
      return this.$manipulatorTarget.get('innerHTML');
    },
    set: function(value) {
      if (this.get() === value.toString(10)) { return this; }
      this.$manipulatorTarget.set('innerHTML', value);
      return this.trigger('change');
    },
    hide: hide,
    show: show
  },
  button: {
    get: function() {
      return this.$manipulatorTarget.get('innerHTML');
    },
    set: function(value) {
      if (this.get() === value.toString(10)) { return this; }
      this.$manipulatorTarget.set('innerHTML', value);
      return this.trigger('change');
    },
    disable: disable,
    enable: enable,
    hide: hide,
    show: show
  },
  val: {
    get: function() {
      return this.$manipulatorTarget.get('value');
    },
    set: function(value) {
      if (this.get() === value.toString(10)) { return this; }
      this.$manipulatorTarget.set('value', value);
      return this.trigger('change');
    },
    disable: disable,
    enable: enable,
    hide: hide,
    show: show
  },
  slider: {
    get: function() {
      return parseFloat(this.$manipulatorTarget.get('value'));
    },
    set: function(value) {
      var initVal = this.get();
      this.$manipulatorTarget.set('value', value);
      if (this.get() === initVal) { return this; }
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
      if (!this.get() === !value) { return this; }
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
      if (this.get() === value.toString(10)) { return this; }
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
      this.$element.select('input').each(function(item) {
        result.push(!!item.checked);
      });
      return result;
    },
    set: function(values) {
      var self = this;
      values = Array.isArray(values) ? values : [];

      while (values.length < this.get().length) {
        values.push(false);
      }

      if (_.equals(this.get(), values)) { return this; }

      self.$element.select('input')
        .set('checked', false)
        .each(function(item, index) {
          item.checked = !!values[index];
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
      return parseInt(this.$manipulatorTarget.get('value'), 10) || 0;
    },
    set: function(value) {
      value = this.roundColorToLayout(value || 0);

      if (this.get() === value) { return this; }
      this.$manipulatorTarget.set('value', value);
      return this.trigger('change');
    },
    disable: disable,
    enable: enable,
    hide: hide,
    show: show
  }
};
