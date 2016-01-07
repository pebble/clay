'use strict';
/* eslint-disable quotes */

module.exports = [
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "id": "main-heading",
        "value": "My Cool App"
      },
      {
        "type": "footer",
        "value": "By Keegan Lillo - <a href=\"http://lillo.me\">Lillo.me</a>"
      }
    ]
  },
  {
    "type": "section",
    "items": [
      {
        "type": "subheading",
        "value": "Settings"
      },
      {
        "type": "block",
        "items": [
          {
            "type": "input",
            "app_key": "greeting",
            "value": "Hello",
            "label": "Greeting",
            "attributes": {
              "placeholder": "Enter a \"greeting\"",
              "limit": 10,
              "required": "required"
            }
          },
          {
            "type": "toggle",
            "app_key": "like_stuff",
            "label": "Enable Cool Stuff",
            "value": true
          },
          {
            "id": "flavor",
            "type": "select",
            "app_key": "flavor",
            "value": "grape",
            "label": "Favorite Flavor",
            "options": [
              { "label": "Berry", "value": "berry" },
              { "label": "Grape", "value": "grape" },
              { "label": "Banana", "value": "banana" }
            ]
          },
          {
            "type": "color",
            "app_key": "background",
            "value": "0xFF0000",
            "label": "Background Color"
          }
        ]
      }
    ]
  },
  {
    "type": "section",
    "items": [
      {
        "type": "submit",
        "value": "Save"
      }
    ]
  }
];
