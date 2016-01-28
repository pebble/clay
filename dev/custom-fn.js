'use strict';

module.exports = function() {
  var Clay = window.Clay = this;

  Clay.getItemByAppKey('cool_stuff').on('change', function() {
    if (this.get()) {
      Clay.getItemByAppKey('background').enable();
    } else {
      Clay.getItemByAppKey('background').disable();
    }
  });

  Clay.getSettings();
};
