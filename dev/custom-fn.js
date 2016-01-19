'use strict';

module.exports = function() {
  var Api = window.Clay = this;

  var testHandler = function() {
    console.debug('KEEGAN: this', this);
    console.debug('KEEGAN: arguments', arguments);
//    Api.getItemByAppKey('background').off(testHandler);
  };

  Api.getItemByAppKey('background').on('change', testHandler);

  console.debug('custom fn worked');
};
