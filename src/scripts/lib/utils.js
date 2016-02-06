'use strict';

/**
 * Batch update all the properties of an object.
 * @param {object} obj
 * @param {object} descriptor
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
