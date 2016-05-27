'use strict';

module.exports = function() {

  /** @type {ClayConfig} */
  var Clay = window.Clay = this;

  /**
   * @returns {void}
   */
  function toggleBackground() {
    if (this.get()) {
      Clay.getItemByAppKey('colorTest').enable();
    } else {
      Clay.getItemByAppKey('colorTest').disable();
    }
  }

  /**
   * @returns {void}
   */
  function handleButtonClick() {
    Clay.config = Clay.meta.userData.config2;
    Clay.build();
  }

  Clay.on(Clay.EVENTS.AFTER_BUILD, function() {
    var coolStuffToggle = Clay.getItemByAppKey('cool_stuff');
    toggleBackground.call(coolStuffToggle);
    coolStuffToggle.on('change', toggleBackground);

    Clay.getItemById('testButton').on('click', handleButtonClick);
  });

  console.log('userData: ', Clay.meta.userData);
};
