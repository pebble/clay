'use strict';

var $ = require('./vendor/minified/minified').$;
var _ = require('./vendor/minified/minified')._;
var ClayConfig = require('./lib/clay-config');
var config = _.extend([], window.clayConfig || []);

var settings = _.extend({}, window.claySettings || {});
var returnTo = window.returnTo || 'pebblejs://close#';
var customFn = window.customFn || function() {};

var $mainForm = $('#main-form');
var clayConfig = new ClayConfig(settings, config, $mainForm);

function submit(event) {
  // Set the return URL depending on the runtime environment
  location.href =
    returnTo + encodeURIComponent(JSON.stringify(clayConfig.getSettings()));
  event.preventDefault();
  return false;
}

$mainForm.on('|submit', submit);

customFn.call(clayConfig);
