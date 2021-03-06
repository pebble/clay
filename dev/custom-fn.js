'use strict';

module.exports = function() {

  /** @type {ClayConfig} */
  var Clay = window.Clay = this;

  /**
   * @returns {void}
   */
  function toggleBackground() {
    if (this.get()) {
      Clay.getItemByMessageKey('colorTest').enable();
    } else {
      Clay.getItemByMessageKey('colorTest').disable();
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
    var coolStuffToggle = Clay.getItemByMessageKey('cool_stuff');
    toggleBackground.call(coolStuffToggle);
    coolStuffToggle.on('change', toggleBackground);

    Clay.getItemById('testButton').on('click', handleButtonClick);
  });

  console.log('userData: ', Clay.meta.userData);
};
