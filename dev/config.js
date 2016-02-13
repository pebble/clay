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
        "defaultValue": true
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
        "appKey": "background",
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
        "id": "flavor",
        "type": "select",
        "appKey": "flavor",
        "defaultValue": "grape",
        "label": "Favorite Flavor",
        "options": [
          { "label": "Berry things", "value": "berry" },
          { "label": "Grape", "value": "grape" },
          { "label": "Banana", "value": "banana" }
        ]
      }
    ]
  },
  {
    "type": "submit",
    "label": "Save"
  }
];
