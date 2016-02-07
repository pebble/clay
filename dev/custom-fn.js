'use strict';

module.exports = function() {

  /** @type {ClayConfig} */
  var Clay = window.Clay = this;

  Clay.on(Clay.EVENTS.BEFORE_BUILD, function() {

    // register components here
    this.registerComponent(require('pebble-clay-components').heading);
    this.registerComponent(require('pebble-clay-components').text);
    this.registerComponent(require('pebble-clay-components').footer);
    this.registerComponent(require('pebble-clay-components').input);
    this.registerComponent(require('pebble-clay-components').color);
    this.registerComponent(require('pebble-clay-components').select);
    this.registerComponent(require('pebble-clay-components').toggle);
    this.registerComponent(require('pebble-clay-components').submit);
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
