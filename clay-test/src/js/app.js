'use strict';
var Clay = require('pebble-clay');
var clay = new Clay({
  config: [
    {
      label: 'test',
      type: 'color',
      messageKey: 'test_int'
    },
    {
      type: 'submit',
      defaultValue: 'submit'
    }
  ],
  closedCallback: function(response) {
    console.log('closedcallback: arguments' + JSON.stringify(arguments));
  }
});

