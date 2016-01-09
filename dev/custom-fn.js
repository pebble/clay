'use strict';

module.exports = function() {
  var Api = this;

  var testHandler = function() {
    console.debug('KEEGAN: EVENT', this);
    Api.getItemByAppKey('background').off(testHandler);
  };

  Api.getItemByAppKey('background').on('change', testHandler);

  console.debug('custom fn worked');
};
