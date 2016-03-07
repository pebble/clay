'use strict';

/**
 * Batch update all the properties of an object.
 * @param {Object} obj
 * @param {Object} descriptor
 * @param {boolean} [descriptor.configurable]
 * @param {boolean} [descriptor.enumerable]
 * @param {*} [descriptor.value]
 * @param {boolean} [descriptor.writable]
 * @param {function} [descriptor.get]
 * @param {function} [descriptor.set]
 * @return {void}
 */
module.exports.updateProperties = function(obj, descriptor) {
  Object.getOwnPropertyNames(obj).forEach(function(prop) {
    Object.defineProperty(obj, prop, descriptor);
  });
};

/**
 * Converts the val into a type compatible with Pebble.sendAppMessage().
 *  - Strings will be returned without modification
 *  - Numbers will be returned without modification
 *  - Booleans will be converted to a 0 or 1
 *  - Arrays that contain strings will be split with a zero.
 *    eg: ['one', 'two'] becomes ['one', 0, 'two', 0]
 *  - Arrays that contain numbers will be returned without modification
 *    eg: [1, 2] becomes [1, 2]
 *  - Arrays that contain booleans will be converted to a 0 or 1
 *    eg: [true, false] becomes [1, 0]
 *  - Arrays must be single dimensional
 * @param {number|string|boolean|Array} val
 * @returns {number|string|Array}
 */
module.exports.prepareForAppMessage = function(val) {
  var result;

  if (typeof val === 'boolean') {
    result = val ? 1 : 0;
  } else if (Array.isArray(val)) {
    result = [];
    val.forEach(function(item) {
      var itemConverted = module.exports.prepareForAppMessage(item);
      result.push(itemConverted);
      if (typeof itemConverted === 'string') {
        result.push(0);
      }
    });
  } else {
    result = val;
  }

  return result;
};
