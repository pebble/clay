'use strict';

window.returnTo = '#';
window.clayConfig = require('./config.js');
window.claySettings = {};
window.customFn = require('./custom-fn.js');
window.clayComponents = require('../src/scripts/components');
window.clayMeta = require('../test/fixture').meta({
  activeWatchInfo: {
    platform: 'basalt',
    model: 'qemu_platform_basalt',
    language: 'en_US',
    firmware: {
      major: 3,
      minor: 10,
      patch: 2,
      suffix: ''
    }
  },
  userData: {
    foo: 'bar',
    config2: require('./config-2')
  }
});

var platform = window.navigator.userAgent.match(/Android/) ? 'android' : 'ios';
document.documentElement.classList.add('platform-' + platform);
