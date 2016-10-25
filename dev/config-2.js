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
    "defaultValue": "This is config 2"
  },
  {
    type: 'thing',
    defaultValue: {
      en_US: 'foo',
      fr_FR: 'bar'
    }
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
        "messageKey": "email",
        "defaultValue": "",
        "label": "Input Field",
        "description": "This is a new field",
        "attributes": {
          "placeholder": "Placeholder set with attributes"
        }
      }
    ]
  },
  {
    "type": "submit",
    "defaultValue": "Save"
  }
];
