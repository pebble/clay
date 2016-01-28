'use strict';

module.exports = function() {

  /** @type {ClayConfig} */
  var Clay = window.Clay = this;

  Clay.getItemByAppKey('cool_stuff').on('change', function() {
    if (this.get()) {
      Clay.getItemByAppKey('background').enable();
    } else {
      Clay.getItemByAppKey('background').disable();
    }
  });

  Clay.on('test', function() {
    console.debug('KEEGAN: this', this);
  });

  Clay.trigger('test');
};
