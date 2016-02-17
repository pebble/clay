'use strict';

window.returnTo = '#';
window.clayConfig = require('./config.js');
window.claySettings = {};
window.customFn = require('./custom-fn.js');
window.clayComponents = require('../src/scripts/components');

var platform = window.navigator.userAgent.match(/Android/) ? 'android' : 'ios';
document.documentElement.classList.add('platform-' + platform);
