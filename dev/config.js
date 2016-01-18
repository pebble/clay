'use strict';
/* eslint-disable quotes */

module.exports = [
  {
    "type": "heading",
    "id": "main-heading",
    "value": "My Cool App",
    "size": 1
  },
  {
    "type": "text",
    "value": "By Keegan Lillo - <a href=\"http://lillo.me\">Lillo.me</a>"
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "value": "Settings"
      },
      {
        "type": "input",
        "app_key": "email",
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
        "app_key": "like_stuff",
        "label": "Enable Cool Stuff",
        "value": false
      },
      {
        "type": "color",
        "app_key": "background",
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
        "value": "Settings"
      },
      {
        "id": "flavor",
        "type": "select",
        "app_key": "flavor",
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
