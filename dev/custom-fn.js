'use strict';

module.exports = function() {

  /** @type {ClayConfig} */
  var Clay = window.Clay = this;

  Clay.on(Clay.EVENTS.BEFORE_BUILD, function() {
    console.debug('KEEGAN: BEFORE_BUILD', this);
  });

  Clay.on(Clay.EVENTS.AFTER_BUILD, function() {
    console.debug('KEEGAN: AFTER_BUILD', this);
    Clay.getItemByAppKey('cool_stuff').on('change', function() {
      if (this.get()) {
        Clay.getItemByAppKey('background').enable();
      } else {
        Clay.getItemByAppKey('background').disable();
      }
    });
  });
};
