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

module.exports.capabilityMap = {
  APLITE: {
    platforms: ['aplite'],
    minFwMajor: 0,
    minFwMinor: 0
  },
  BASALT: {
    platforms: ['basalt'],
    minFwMajor: 0,
    minFwMinor: 0
  },
  CHALK: {
    platforms: ['chalk'],
    minFwMajor: 0,
    minFwMinor: 0
  },
  DIORITE: {
    platforms: ['diorite'],
    minFwMajor: 0,
    minFwMinor: 0
  },
  EMERY: {
    platforms: ['emery'],
    minFwMajor: 0,
    minFwMinor: 0
  },
  BW: {
    platforms: ['aplite', 'diorite'],
    minFwMajor: 0,
    minFwMinor: 0
  },
  COLOR: {
    platforms: ['basalt', 'chalk', 'emery'],
    minFwMajor: 0,
    minFwMinor: 0
  },
  MICROPHONE: {
    platforms: ['basalt', 'chalk', 'diorite', 'emery'],
    minFwMajor: 0,
    minFwMinor: 0
  },
  SMARTSTRAP: {
    platforms: ['basalt', 'chalk', 'diorite', 'emery'],
    minFwMajor: 3,
    minFwMinor: 4
  },
  SMARTSTRAP_POWER: {
    platforms: ['basalt', 'chalk', 'emery'],
    minFwMajor: 3,
    minFwMinor: 4
  },
  HEALTH: {
    platforms: ['basalt', 'chalk', 'diorite', 'emery'],
    minFwMajor: 3,
    minFwMinor: 10
  },
  RECT: {
    platforms: ['aplite', 'basalt', 'diorite', 'emery'],
    minFwMajor: 0,
    minFwMinor: 0
  },
  ROUND: {
    platforms: ['chalk'],
    minFwMajor: 3,
    minFwMinor: 4
  },
  DISPLAY_144x168: {
    platforms: ['aplite', 'basalt', 'diorite'],
    minFwMajor: 0,
    minFwMinor: 0
  },
  DISPLAY_180x180_ROUND: {
    platforms: ['chalk'],
    minFwMajor: 0,
    minFwMinor: 0
  },
  DISPLAY_200x228: {
    platforms: ['emery'],
    minFwMajor: 0,
    minFwMinor: 0
  }
};

/**
 * Checks if all of the provided capabilities are compatible with the watch
 * @param {Object} activeWatchInfo
 * @param {Array} [capabilities]
 * @return {boolean}
 */
module.exports.includesCapability = function(activeWatchInfo, capabilities) {
  if (!capabilities || !capabilities.length) {
    return true;
  }

  for (var i = capabilities.length - 1; i >= 0; i--) {
    var capability = capabilities[i];
    var mapping = module.exports.capabilityMap[capability];
    if (!mapping ||
        mapping.platforms.indexOf(activeWatchInfo.platform) === -1 ||
        mapping.minFwMajor > activeWatchInfo.firmware.major ||
        mapping.minFwMajor === activeWatchInfo.firmware.major &&
        mapping.minFwMinor > activeWatchInfo.firmware.minor
    ) {
      return false;
    }
  }
  return true;
};
