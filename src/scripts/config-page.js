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

clayConfig.on(clayConfig.EVENTS.BEFORE_BUILD, function() {

  // register components here
  this.registerComponent(require('./components/heading'));
  this.registerComponent(require('./components/text'));
  this.registerComponent(require('./components/footer'));
  this.registerComponent(require('./components/input'));
  this.registerComponent(require('./components/color'));
  this.registerComponent(require('./components/select'));
  this.registerComponent(require('./components/toggle'));
  this.registerComponent(require('./components/radiogroup'));
  this.registerComponent(require('./components/submit'));
});

clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function() {
  var self = this;

  // add listeners here
  $mainForm.on('submit', function(event) {
    // Set the return URL depending on the runtime environment
    location.href =
      returnTo + encodeURIComponent(JSON.stringify(self.getSettings()));
    event.preventDefault();
    return false;
  });
});

// Run the custom function in the context of the ClayConfig
customFn.call(clayConfig);

// Now that we have given the dev's custom code to run and attach listeners,
// we build the config
clayConfig.build();
