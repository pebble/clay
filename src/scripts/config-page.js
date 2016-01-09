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

var itemTypes = require('./lib/items');
var $ = require('./vendor/minified/minified').$;
var _ = require('./vendor/minified/minified')._;
var HTML = require('./vendor/minified/minified').HTML;

var config = _.extend([], window.clayConfig || []);
var settings = _.extend({}, window.claySettings || {});
var returnTo = window.returnTo || 'pebblejs://close#';
var customFn = window.customFn;

function submit(event) {
  _.each(api.itemsByAppKey, function(appKey, item) {
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
      $parent.add(HTML('<div class="section">'))
    );
  } else if (item.type === 'block') {
    processConfigItem(
      item.items,
      $parent.add(HTML('<div class="block">'))
    );
  } else {
    console.debug('KEEGAN: itemType', item.type);
    var apiItem = {};
    var itemType = itemTypes[item.type];
    var templateData = {
      label: '',
      options: [],
      attributes: {}
    };

    console.debug('KEEGAN: templateData', templateData);

    _.extend(templateData, item);
    apiItem.$element = HTML(_.formatHtml(itemType.template, templateData));
    apiItem.$manipulatorTarget =
      apiItem.$element.select('[data-manipulator-target]');

    // this caters for situations where the manipulator target is the root element
    if (!apiItem.$manipulatorTarget.length) {
      apiItem.$manipulatorTarget = apiItem.$element;
    }

    // proxy event related methods
    var eventProxies = {};
    apiItem.on = function(events, handler) {
      eventProxies[handler] = function(event) {
        handler.call(apiItem, event);
      };
      return apiItem.$manipulatorTarget.on(events, eventProxies[handler]);
    };
    apiItem.one = function(events, handler) {
      eventProxies[handler] = function(event) {
        handler.call(apiItem, event);
        $.off(eventProxies[handler]);
      };
      return apiItem.$manipulatorTarget.on(events, eventProxies[handler]);
    };
    apiItem.off = function(handler) {
      return $.off(eventProxies[handler]);
    };

    apiItem.trigger =
      apiItem.$manipulatorTarget.trigger.bind(apiItem.$manipulatorTarget);

    // attach the manipulator methods to the apiItem
    _.eachObj(itemType.manipulator, function(methodName, method) {
      apiItem[methodName] = method.bind(apiItem);
    });

    apiItem.config = item;

    // attach the initialize method to the API.
    apiItem.iniialize = typeof itemType.initialize === 'function' ?
      itemType.initialize :
      function() {};
    apiItem.iniialize.bind(apiItem);
    apiItem.iniialize();

    // set the value of the item via the manipulator to ensure consistency
    apiItem.set(getSetting(item.app_key, item.value));

    if (item.id) {
      api.itemsById[item.id] = apiItem;
    }

    if (item.app_key) {
      api.itemsByAppKey[item.app_key] = apiItem;
    }

    api.items.push(apiItem);

    $parent.add(apiItem.$element);
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
