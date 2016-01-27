'use strict';
/* eslint-disable quotes */

module.exports = [
  {
    "type": "heading",
    "id": "main-heading",
    "value": "Clay Test Page",
    "size": 1
  },
  {
    "type": "text",
    "value": "Some arbitrary text explaining how this all works. " +
             "It's cool if this wraps across multiple lines"
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "value": "This is a section"
      },
      {
        "type": "input",
        "appKey": "email",
        "value": "",
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
        "value": false
      },
      {
        "type": "color",
        "appKey": "background",
        "value": "0xFF0000",
        "label": "Background Color"
      }
    ]
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "value": "More Settings"
      },
      {
        "id": "flavor",
        "type": "select",
        "appKey": "flavor",
        "value": "grape",
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
