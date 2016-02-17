'use strict';
/* eslint-disable quotes */

module.exports = [
  {
    "type": "heading",
    "id": "main-heading",
    "defaultValue": "Clay Test Page",
    "size": 1
  },
  {
    "type": "text",
    "defaultValue": "Some arbitrary text explaining how this all works. " +
             "It's cool if this wraps across multiple lines"
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "This is a section"
      },
      {
        "type": "input",
        "appKey": "email",
        "defaultValue": "",
        "label": "Email",
        "attributes": {
          "placeholder": "eg: name@domain.com",
          "limit": 10,
          "required": "required",
          type: "email"
        }
      },
      {
        "type": "toggle",
        "appKey": "cool_stuff",
        "label": "Enable Cool Stuff",
        "defaultValue": false
      },
      {
        "type": "color",
        "appKey": "colorTest",
        "defaultValue": "FF0000",
        "label": "Background Color",
        "sunlight": false
      },
      {
        "type": "color",
        "appKey": "sunnyColorTest",
        "defaultValue": "00FF00",
        "label": "Sunny Color",
        "sunlight": true
      }
    ]
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "More Settings"
      },
      {
        "type": "radiogroup",
        "appKey": "radiogroup-test",
        "label": "Radio test",
        "options": [
          { "label": "Test thing one", "value": "one" },
          { "label": "Another thing", "value": "two" },
          { "label": "One really long thing that would not fit", "value": "three" },
          { "label": "Small", "value": "quote' \"test" },
          { "label": "Final thing", "value": "three" }
        ]
      },
      {
        "type": "checkboxgroup",
        "appKey": "checkboxgroup-test",
        "defaultValue": ["quote' \"test", "two"],
        "label": "Checkbox test",
        "options": [
          { "label": "Test <strong>thing</strong> one", "value": "one" },
          { "label": "Another thing", "value": "two" },
          { "label": "One really long thing that would not fit", "value": "three" },
          { "label": "Small", "value": "quote' \"test" },
          { "label": "Final thing", "value": "three" }
        ]
      },
      {
        "type": "input",
        "appKey": "date",
        "defaultValue": "",
        "label": "Range",
        "attributes": {
          type: "range"
        }
      },
      {
        "type": "select",
        "appKey": "flavor",
        "defaultValue": "grape",
        "label": "Favorite Flavor",
        "options": [
          { "label": "", "value": "" },
          { "label": "Berry", "value": "berry" },
          { "label": "Grape", "value": "grape" },
          { "label": "Banana", "value": "banana" }
        ],
        "attributes": {
          "required": "required"
        }
      }
    ]
  },
  {
    "type": "submit",
    "defaultValue": "Save"
  }
];
