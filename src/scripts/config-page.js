'use strict';

/**
 * A Clay config Item
 * @typedef {object} Clay~Item
 * @property {string} type
 * @property {string} app_key
 * @property {string} id
 * @property {string} content
 * @property {string|boolean} default
 * @property {string} label
 * @property {object} attributes
 * @property {array} options
 * @property {array} items
 */

var mustache = require('mustache');
var itemTypes = require('./lib/item-types');
var $ = require('zepto-browserify').$;

var config = $.extend(true, [], window.clayConfig || []);
var settings = $.extend(true, {}, window.claySettings || {});

// Get query variables
function getQueryParam(variable, defaultValue) {
  var query = location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');

    if (pair[0] === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return defaultValue || false;
}

function submit() {
  // Set the return URL depending on the runtime environment
  var return_to = getQueryParam('return_to', 'pebblejs://close#');
  document.location = return_to + encodeURIComponent(JSON.stringify(settings));
}

/**
 *
 * @param {string} key
 * @param {string|boolean} _default
 * @return {string|boolean}
 */
function getSetting(key, _default) {
  return typeof settings[key] !== 'undefined' ? settings[key] : (_default || '');
}

function setSetting(key, value) {
  settings[key] = value;
}

/**
 * @param {Clay~Item} item
 * @param {$} $parent
 */
function processConfigItem(item, $parent) {
  // @todo add validation on the Item

  if (Array.isArray(item)) {
    item.forEach(function(item) {
      processConfigItem(item, $parent);
    });
  } else if (item.type === 'section') {
    processConfigItem(
      item.items,
      $('<div class="item-container">').appendTo($parent)
    );
  } else if (item.type === 'block') {
    processConfigItem(
      item.items,
      $('<div class="item-container-content">').appendTo($parent)
    );
  } else {
    var apiItem = {};
    var itemType = itemTypes[item.type];
    var templateData = $.extend({}, item, {
      attributes: $.map(item.attributes || [], function(item, key) {
        return {
          key: key,
            // .replace('"', '&quot;'),
          value: item.toString()
            // .replace('"', '&quot;')
        };
      }),
      value: typeof itemType.valueTransformer === 'function' ?
        itemType.valueTransformer(getSetting(item.app_key, item.default), item) :
        getSetting(item.app_key, item.default)
    });

    apiItem.$element = $(mustache.render(itemType.template, templateData));
    apiItem.$manipulatorTarget = apiItem.$element.find('[data-manipulator-target]');
    apiItem.on = function(events, handler) {
      return apiItem.$manipulatorTarget.on(events, $.proxy(handler, apiItem));
    };
    apiItem.one = function(events, handler) {
      return apiItem.$manipulatorTarget.one(events, $.proxy(handler, apiItem));
    };
    apiItem.off = apiItem.$manipulatorTarget.off.bind(apiItem.$manipulatorTarget);
    apiItem.triggerHandler =
      apiItem.$manipulatorTarget.triggerHandler.bind(apiItem.$manipulatorTarget);

    // attach the manipulator methods the the apiItem
    $.each(itemType.manipulator, function(methodName, method) {
      apiItem[methodName] = method.bind(apiItem);
    });

    apiItem.config = item;

    if (item.id) {
      _interface.itemsById[item.id] = apiItem;
    }

    if (item.app_key) {
      _interface.itemsByAppKey[item.app_key] = apiItem;
    }

    _interface.items.push(apiItem);

    $parent.append(apiItem.$element);
  }
}

var _interface = {
  items: [],
  itemsById: {},
  itemsByAppKey: {}
};

var $mainForm = $('#main-form');

_interface.getItemByAppKey = function(key) {
  return _interface.itemsByAppKey[key];
};

_interface.getItemById = function(key) {
  return _interface.itemsById[key];
};

_interface.getItemsByType = function(type) {
  return _interface.items.filter(function(item) {
    return item.config.type === type;
  });
};

processConfigItem(config, $mainForm, 0);

$mainForm.submit(submit);

module.exports = _interface;
window._interface = _interface;

console.log(_interface);
