'use strict';
var Clay = require('pebble-clay');
var clay = new Clay({
  config: [
    {
      type: 'section',
      items: [
        {
          label: 'int',
          type: 'color',
          messageKey: 'test_int'
        },
        {
          label: 'char',
          type: 'input',
          messageKey: 'test_char'
        },
        {
          label: 'bool',
          type: 'toggle',
          messageKey: 'test_bool'
        },
        {
          label: 'array',
          type: 'checkboxgroup',
          messageKey: 'test_array',
          options: ['one', 'two', 'three']
        },
        {
          type: 'submit',
          defaultValue: 'submit'
        }
      ]
    }
  ],
  closedCallback: function(response) {
    console.log('closedcallback: arguments' + JSON.stringify(arguments));
  }
});

