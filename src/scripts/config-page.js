'use strict';

var $ = require('./vendor/minified/minified').$;
var _ = require('./vendor/minified/minified')._;
var Api = require('./lib/api');
var config = _.extend([], window.clayConfig || []);

var settings = _.extend({}, window.claySettings || {});
var returnTo = window.returnTo || 'pebblejs://close#';
var customFn = window.customFn || function() {};

var api = new Api(settings);
var $mainForm = $('#main-form');

function submit(event) {
  _.each(api.itemsByAppKey, function(appKey, item) {
    settings[appKey] = item.get();
  });
  // Set the return URL depending on the runtime environment
  location.href = returnTo + encodeURIComponent(JSON.stringify(settings));
  event.preventDefault();
  return false;
}

api.addItem(config, $mainForm);

//$mainForm.on('submit', submit);

customFn.call(api);
