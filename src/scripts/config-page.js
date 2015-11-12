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
 * @property {Array} options
 * @property {Array} items
 */

var mustache = require('mustache');
var itemTypes = require('./lib/item-types');
var $ = require('zepto-browserify').$;

var config = $.extend(true, [], window.clayConfig || []);
var settings = $.extend(true, {}, window.claySettings || {});
var returnTo = window.returnTo || 'pebblejs://close#';
var customFn = window.customFn;

function submit(event) {
  $.each(api.itemsByAppKey, function(appKey, item) {
    settings[appKey] = item.get();
  });
  // Set the return URL depending on the runtime environment
  location.href = returnTo + encodeURIComponent(JSON.stringify(settings));
  event.preventDefault();
  return false;
}

/**
 *
 * @param {string} key
 * @param {string|boolean} defaultValue
 * @return {string|boolean}
 */
function getSetting(key, defaultValue) {
  return typeof settings[key] !== 'undefined' ? settings[key] : (defaultValue || '');
}

// function setSetting(key, value) {
//   settings[key] = value;
// }

var index = 0;

/**
 * @param {Clay~Item|Array} item
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
        console.log(index);
        return {
          key: key,
          value: item.toString(),
          index: index++
        };
      })
    });

    apiItem.$element = $(mustache.render(itemType.template, templateData));
    apiItem.$manipulatorTarget = apiItem.$element.find('[data-manipulator-target]');

    // this caters for situations where the manipulator target is the root element
    if (!apiItem.$manipulatorTarget.length) {
      apiItem.$manipulatorTarget = apiItem.$element;
    }

    // proxy event related methods
    apiItem.on = function(events, handler) {
      return apiItem.$manipulatorTarget.on(events, $.proxy(handler, apiItem));
    };
    apiItem.one = function(events, handler) {
      return apiItem.$manipulatorTarget.one(events, $.proxy(handler, apiItem));
    };
    apiItem.off = apiItem.$manipulatorTarget.off.bind(apiItem.$manipulatorTarget);
    apiItem.triggerHandler =
      apiItem.$manipulatorTarget.triggerHandler.bind(apiItem.$manipulatorTarget);

    // attach the manipulator methods to the apiItem
    $.each(itemType.manipulator, function(methodName, method) {
      apiItem[methodName] = method.bind(apiItem);
    });

    // set the value of the item via the manipulator to ensure consistency
    apiItem.set(getSetting(item.app_key, item.value));

    apiItem.config = item;

    if (item.id) {
      api.itemsById[item.id] = apiItem;
    }

    if (item.app_key) {
      api.itemsByAppKey[item.app_key] = apiItem;
    }

    api.items.push(apiItem);

    $parent.append(apiItem.$element);
  }
}

var api = {
  items: [],
  itemsById: {},
  itemsByAppKey: {}
};

var $mainForm = $('#main-form');

api.getItemByAppKey = function(key) {
  return api.itemsByAppKey[key];
};

api.getItemById = function(key) {
  return api.itemsById[key];
};

api.getItemsByType = function(type) {
  return api.items.filter(function(item) {
    return item.config.type === type;
  });
};

processConfigItem(config, $mainForm);
$mainForm.on('submit', submit);

module.exports = api;
customFn.call(api);
