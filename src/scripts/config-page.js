'use strict';

var minified = require('./vendor/minified');
var ClayConfig = require('./lib/clay-config');

var $ = minified.$;
var _ = minified._;

var config = _.extend([], window.clayConfig || []);
var settings = _.extend({}, window.claySettings || {});
var returnTo = window.returnTo || 'pebblejs://close#';
var customFn = window.customFn || function() {};
var clayComponents = window.clayComponents || {};
var clayMeta = window.clayMeta || {};

var platform = window.navigator.userAgent.match(/android/i) ? 'android' : 'ios';
document.documentElement.classList.add('platform-' + platform);

// Register the passed components
_.eachObj(clayComponents, function(key, component) {
  ClayConfig.registerComponent(component);
});

var $mainForm = $('#main-form');
var clayConfig = new ClayConfig(settings, config, $mainForm, clayMeta);

// add listeners here
$mainForm.on('submit', function() {
  // Set the return URL depending on the runtime environment
  location.href = returnTo +
                  encodeURIComponent(JSON.stringify(clayConfig.serialize()));
});

// Run the custom function in the context of the ClayConfig
customFn.call(clayConfig, minified);

// Now that we have given the dev's custom code to run and attach listeners,
// we build the config
clayConfig.build();
