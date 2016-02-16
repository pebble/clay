# Clay
Clay is a JavaScript library that makes it super easy to add offline configuration pages to your Pebble apps. All you need to get started is a couple lines of JavaScript and a JSON file, no servers or HTML required.

**Clay is still in early development and missing some features. We would love your feedback so please submit any ideas or features you would like via GitHub issues.**

# Getting Started

Clay will eventually be built into the Pebble SDK. However while it is still in beta, you will need to follow some steps

1. Download the Clay distribution file from: [dist/clay.js](dist/clay.js)
2. Drop `clay.js` in your project's `src/js` directory. 
3. Create a JSON file called `config.json` and place it in your `src/js` directory. 
4. in order for JSON files to work you may need to change the line in your `wscript` from `ctx.pbl_bundle(binaries=binaries, js=ctx.path.ant_glob('src/js/**/*.js'))` to `ctx.pbl_bundle(binaries=binaries, js=ctx.path.ant_glob('src/js/**/*.js*'))`
5. Your `app.js` needs to `require` clay and your config file, then be initialized:
```javascript
var Clay = require('clay');
var clayConfig = require('config.json');
var clay = new Clay(clayConfig);
```
6. Now in your `showConfiguration` handler you let clay generate the URL for you. It should look something like:
```javascript
Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL(clay.generateUrl());
});
```
7. In order for your Pebble app to receive the configuration, you need to get the settings from Clay. Your `webviewclosed` handler should now look something like: 
```javascript
Pebble.addEventListener('webviewclosed', function(e) {
  // Send settings to Pebble watchapp
  Pebble.sendAppMessage(clay.getSettings(e.response), function(e) {
    console.log('Sent config data to Pebble');
  }, function() {
    console.log('Failed to send config data!');
    console.log(JSON.stringify(e));
  });
});
```
8. Next is the fun part. Creating your config page. Edit your `config.json` file using the instructions below

# Creating Your Config File

Clay uses javascript objects (or JSON) to generate the config page for you. The structure of the page is totally up to you, but you do need to follow some basic rules. 

## Basic JSON structure 

Your root element should be an array. This represents the entire page. Inside this array you place your config items. Each config item is an object with some properties that configure how each item should be displayed. 

#### Example:
```javascript
[
  { type: 'heading', defaultValue: 'Example Config Page' },
  { type: 'text', defaultValue: 'Clay makes things easy.' }
  //... etc etc
]
```

## Components

### Section

Sections help divide up the page into logical separations. It is recommended that you place all your input based items in a section for maximum prettiness. 

##### Properties

| Property | Type | Description |
|----------|------|-------------|
| type | string | set to "section"
| items | array | array of items to include in the section

##### Example
```javascript
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
      "label": "Email"
    },
    {
      "type": "toggle",
      "appKey": "enableThings",
      "label": "Enable things"
    }
  ]
}
```

---

### Heading

**Manipulator:** `html`

Headings can be used in anywhere and can have their size adjusted to suit the context. If you place a heading item at the first position of a **section's** `items` array then it will automatically be styled as a header for that section. 

##### Properties

| Property | Type | Description 
|----------|------|-------------
| type | string | set to "heading" 
| id | string (unique) | Set this to a unique string to allow this item to be looked up using `Clay.getItemsById()` in your custom function.
| appKey | string (unique) | The appKey matching what is defined in your `appinfo.json`.  Set this to a unique string to allow this item to be looked up using `Clay.getItemsByAppKey()` in your custom function. You must set this if you wish for the value of this item to be saved after the user closes the config page. 
| defaultValue | string/HTML | The heading text.
| size | int | Defaults to `4`. An integer from 1 to 6 where 1 is the largest size and 6 is the smallest. (represents HTML `<h1>`, `<h2>`, `<h3>`, etc)


##### Example
```javascript
{
  "type": "heading",
  "id": "main-heading",
  "defaultValue": "My Cool Watchface",
  "size": 1,
  "attributes": {
    ""
  }
}
```

---

### Text

**Manipulator:** `html`

Text is used to provide descriptions of sections or to explain complex parts of your page. Feel free to add any extra HTML you require to the `defaultValue` 

##### Properties

| Property | Type | Description 
|----------|------|-------------
| type | string | set to "text" 
| id | string (unique) | Set this to a unique string to allow this item to be looked up using `Clay.getItemsById()` in your custom function.
| appKey | string (unique) | The appKey matching what is defined in your `appinfo.json`.  Set this to a unique string to allow this item to be looked up using `Clay.getItemsByAppKey()` in your custom function. You must set this if you wish for the value of this item to be saved after the user closes the config page. 
| defaultValue | string/HTML | The content of the text.


##### Example
```javascript
{
  "type": "text",
  "defaultValue": "An explanation of how things work",
}
```

---

### Input

**Manipulator:** `val`

Standard text input field. 

##### Properties

| Property | Type | Description 
|----------|------|-------------
| type | string | set to "input" 
| id | string (unique) | Set this to a unique string to allow this item to be looked up using `Clay.getItemsById()` in your custom function.
| appKey | string (unique) | The appKey matching what is defined in your `appinfo.json`.  Set this to a unique string to allow this item to be looked up using `Clay.getItemsByAppKey()` in your custom function. You must set this if you wish for the value of this item to be saved after the user closes the config page. 
| label | string | The label that should appear next to the item
| defaultValue | string | The default value of the text field 
| attributes | object | A hash of HTML attributes to set on the input field. You can add basic HTML5 validation this way by setting attributes such as `required` or `type` .


##### Example
```javascript
{
  "type": "input",
  "appKey": "email",
  "defaultValue": "",
  "label": "Email",
  "attributes": {
    "placeholder": "eg: name@domain.com",
    "limit": 10,
    "required": "required",
    "type": "email"
  }
}
```

---

#### Toggle

**Manipulator:** `checked`

Switch for a single item. 

##### Properties

| Property | Type | Description 
|----------|------|-------------
| type | string | set to "toggle" 
| id | string (unique) | Set this to a unique string to allow this item to be looked up using `Clay.getItemsById()` in your custom function.
| appKey | string (unique) | The appKey matching what is defined in your `appinfo.json`.  Set this to a unique string to allow this item to be looked up using `Clay.getItemsByAppKey()` in your custom function. You must set this if you wish for the value of this item to be saved after the user closes the config page. 
| label | string | The label that should appear next to the item
| defaultValue | boolean | The default value of the toggle. Defaults to `false`
| attributes | object | A hash of HTML attributes to set on the input field. You can add basic HTML5 validation this way by setting attribute such as `required`.  


##### Example
```javascript
{
  "type": "toggle",
  "appKey": "invert",
  "label": "Invert Colors",
  "defaultValue": true,
  "attributes": {
    "required": "required"
  }
}
```

---

#### Select

**Manipulator:** `val`

A dropdown menu

##### Properties

| Property | Type | Description 
|----------|------|-------------
| type | string | set to "select" 
| id | string (unique) | Set this to a unique string to allow this item to be looked up using `Clay.getItemsById()` in your custom function.
| appKey | string (unique) | The appKey matching what is defined in your `appinfo.json`.  Set this to a unique string to allow this item to be looked up using `Clay.getItemsByAppKey()` in your custom function. You must set this if you wish for the value of this item to be saved after the user closes the config page. 
| label | string | The label that should appear next to the item
| defaultValue | string | The default value of dropdown. Must match a value in the `options` array
| attributes | object | A hash of HTML attributes to set on the input field. You can add basic HTML5 validation this way by setting attribute such as `required`.  
| options | array of objects | The options you want to appear in the dropdown. Each option is an object with a `label` and `value` property. 

##### Example
```javascript
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
```

---

#### Color

**Manipulator:** `color`

A color picker. 

##### Properties

| Property | Type | Description 
|----------|------|-------------
| type | string | set to "color" 
| id | string (unique) | Set this to a unique string to allow this item to be looked up using `Clay.getItemsById()` in your custom function.
| appKey | string (unique) | The appKey matching what is defined in your `appinfo.json`.  Set this to a unique string to allow this item to be looked up using `Clay.getItemsByAppKey()` in your custom function. You must set this if you wish for the value of this item to be saved after the user closes the config page. 
| label | string | The label that should appear next to the item
| defaultValue | string OR int | The default color. Always use the uncorrected value even if `sunlight` is true. The component will do the conversion internally. 
| sunlight | boolean | Switch between uncorrected and sunlight color palette. Defaults to `true`

##### Example
```javascript
{
  "type": "color",
  "appKey": "background",
  "defaultValue": "FF0000",
  "label": "Background Color",
  "sunlight": true
},
```

---

#### RadioGroup

**Manipulator:** `radiogroup`

A list of options where a user can only choose one

##### Properties

| Property | Type | Description 
|----------|------|-------------
| type | string | set to "radiogroup" 
| id | string (unique) | Set this to a unique string to allow this item to be looked up using `Clay.getItemsById()` in your custom function.
| appKey | string (unique) | The appKey matching what is defined in your `appinfo.json`.  Set this to a unique string to allow this item to be looked up using `Clay.getItemsByAppKey()` in your custom function. You must set this if you wish for the value of this item to be saved after the user closes the config page. 
| label | string | The label that should appear next to the item
| defaultValue | string | The default selected item. Must match a value in the `options` array
| attributes | object | A hash of HTML attributes to set on the input field. You can add basic HTML5 validation this way by setting attribute such as `required`.  
| options | array of objects | The options you want to appear in the dropdown. Each option is an object with a `label` and `value` property. 

##### Example
```javascript
{
  "type": "radiogroup",
  "appKey": "favorite_food",
  "label": "Favorite Food",
  "options": [
    { "label": "Sushi", "value": "sushi" },
    { "label": "Pizza", "value": "pizza" },
    { "label": "Burgers", "value": "burgers" }
  ]
},
```

---

#### CheckboxGroup

**Manipulator:** `checkboxgroup`

A list of options where a user may choose multiple

##### Properties

| Property | Type | Description 
|----------|------|-------------
| type | string | set to "checkboxgroup" 
| id | string (unique) | Set this to a unique string to allow this item to be looked up using `Clay.getItemsById()` in your custom function.
| appKey | string (unique) | The appKey matching what is defined in your `appinfo.json`.  Set this to a unique string to allow this item to be looked up using `Clay.getItemsByAppKey()` in your custom function. You must set this if you wish for the value of this item to be saved after the user closes the config page. 
| label | string | The label that should appear next to the item
| defaultValue | array of strings | The default selected items. Must match the values in the `options` array
| attributes | object | A hash of HTML attributes to set on the input field. You can add basic HTML5 validation this way by setting attribute such as `required`.  
| options | array of objects | The options you want to appear in the dropdown. Each option is an object with a `label` and `value` property. 

##### Example
```javascript
{
  "type": "checkboxgroup",
  "appKey": "favorite_food",
  "label": "Favorite Food",
  "defaultValue": ["sushi", "burgers"],
  "options": [
    { "label": "Sushi", "value": "sushi" },
    { "label": "Pizza", "value": "pizza" },
    { "label": "Burgers", "value": "burgers" }
  ]
},
```

---

### Submit

**Manipulator:** `html`

The submit button for the page. You **MUST** include this component somewhere or users will not be able to save the form. 

##### Properties

| Property | Type | Description 
|----------|------|-------------
| type | string | set to "submit" 
| defaultValue | string | The text displayed in the button
| attributes | object | A hash of HTML attributes to set on the input field. 

##### Example
```javascript
{
  "type": "submit",
  "label": "Save"
}
```

---

### Coming Soon...

- Range Slider
- Generic Button
- Tabs
- Footer
- dynamic + draggable list

---

## Manipulators 

Each component has a **manipulator.** This is a set of methods used to talk to the item on the page. At a minimum, manipulators must have a `.get()` and `.set(value)` method. When the config page is closed, the `.get()` method is run on all components registered with an `appKey`. Many of these methods fire an event when the method is called. You can listen for these events with `ClayItem.on()`

#### html
| Method | Returns | Event Fired | Description 
|---
| `.set( [string/HTML] value)` | `ClayItem` | `change` | sets the content of the item
| `.get()` | `string` | | gets the content of the item

#### val
| Method | Returns | Event Fired | Description 
|---
| `.set( [string] value)` | `ClayItem` | `change` | sets the value of the item
| `.get()` |  `string` | | gets the content of the item
| `.disable()` |  `ClayItem` | `disabled` | Prevents the item from being edited by the user
| `.enable()` |  `ClayItem` | `enabled` | Allows the item to be edited by the user

#### checked
| Method | Returns | Event Fired | Description 
|---
| `.set( [boolean] value)` | `ClayItem` | `change` | check/uncheck the state of the item
| `.get()` |  `string` | | gets the content of the item
| `.disable()` | `ClayItem` | `disabled` | Prevents the item from being edited by the user
| `.enable()` | `ClayItem` | `enabled` | Allows the item to be edited by the user

#### color
| Method | Returns | Event Fired | Description 
|---
| `.set( [string \| int] value)` | `ClayItem` | `change` | sets the color picker to the provided color. If the value is a string, it must be provided in hex notation eg `'FF0000'`.
| `.get()` | `int` | | The color is returned as an int in order to make it easy to be used on the watch side using `GColorFromHEX()`
| `.disable()` | `ClayItem` | `disabled` | Prevents the item from being edited by the user
| `.enable()` | `ClayItem` | `enabled` | Allows the item to be edited by the user

#### radiogroup
| Method | Returns | Event Fired | Description 
|---
| `.set( [string] value)` | `ClayItem` | `change` | checks the radio button that corresponds to the provided value
| `.get()` |  `string` | | gets the value of the checked radio button in the list
| `.disable()` | `ClayItem` | `disabled` | Prevents the item from being edited by the user
| `.enable()` | `ClayItem` | `enabled` | Allows the item to be edited by the user

#### checkboxgroup
| Method | Returns | Event Fired | Description 
|---
| `.set( [Array] value)` | `ClayItem` | `change` | checks the checkboxes that corresponds to the provided list of values
| `.get()` |  `string` | | gets the value of the checked radio button in the list
| `.disable()` | `ClayItem` | `disabled` | Prevents the item from being edited by the user
| `.enable()` | `ClayItem` | `enabled` | Allows the item to be edited by the user


# Extending Clay

Clay is built to allow developers to add their own basic interactivity to the config page. This is done in a number of ways:

## Custom Function

When initializing Clay in your `app.js`, you can optionally provide a function that will be copied and run on the generated config page. **IMPORTANT:** This function is injected by running `.toString()` on it. If you are making use of `require` or any other dynamic features, they will not work. You must make sure that everything the function needs to execute is available in the function body itself. 

This function, when injected into the config page will be run with `ClayConfig` as its context (`this`), and **Minified** as its first parameter. Read below for more information on **Minified**

#### Example 

##### app.js

```javascript
var Clay = require('./clay');
var clayConfig = require('./config');
var customClay = require('./custom-clay');
var clay = new Clay(clayConfig, customClay);
```

##### custom-clay.js

```javascript
module.exports = function(minified) {
  var Clay = this;
  var _ = minified._;
  var $ = minified.$;
  var HTML = minified.HTML;

  function toggleBackground() {
    if (this.get()) {
      Clay.getItemByAppKey('background').enable();
    } else {
      Clay.getItemByAppKey('background').disable();
    }
  }

  Clay.on(Clay.EVENTS.AFTER_BUILD, function() {
    var coolStuffToggle = Clay.getItemByAppKey('cool_stuff');
    toggleBackground.call(coolStuffToggle);
    coolStuffToggle.on('change', toggleBackground);
  });
};
```

## Clay API

### `ClayConfig([Object] settings, [Array] config, [$Minified] $rootContainer)`

This is the main way of talking to your generated config page. A reference to the instance of `ClayConfig` is passed to 

#### Properties

| Property | Type | Description
| ---
| `.EVENTS.BEFORE_BUILD` | String | Dispatched prior to building the page.
| `.EVENTS.AFTER_BUILD` | String | Dispatched after building the page.
| `.config` | Array | Reference to the config passed to the constructer and used for generating the page. 


#### Methods

| Method | Returns 
| ---
| `.getAllItems()` | `Array.<ConfigItem>` - an array of all config items
| `.getItemByAppKey( [string] appKey )` | `ConfigItem\|undefined` - a single `ConfigItem` that has the provided `appKey` otherwise `undefined`
| `.getItemById( [string] id )` | `ConfigItem\|undefined` - a single `ConfigItem` that has the provided `id` otherwise `undefined`
| `.getItemsByType( [string] type )` | `Array.<ConfigItem>` - an array of config items that match the provided `type`
| `.getSettings()` | `Object` - a hash representing all items with an `appKey` where the key is the `appKey` and the value is the result of running `.get()` on the Clay item. 
| `.build()` <br> Builds the config page. Will dispatch the `BEFORE_BUILD` event prior to building the page, then the `AFTER_BUILD` event once it is complete. | `ClayConfig` 
| `.on( [string] events, [function] handler )` <br> Register an event to the provided handler. The handler will be called with this instance of `ClayConfig` as the context. If you wish to register multiple events to the same handler, then separate the events with a space | `ClayConfig`
| `.off( [function] handler )` <br> Remove the given event handler. **NOTE:** This will remove the handler from all registered events | `ClayConfig`
| `.trigger( [string] name, [object] eventObj={} )` <br> Trigger the provided event and optionally pass extra data to the handler. | `ClayConfig`
| `.registerComponent( [ClayComponent] component )` <br> Registers a component. You must register all components prior to calling `.build()`. This method is available statically as well | `Boolean` - `true` if the component was registered successfully, otherwise `false`.  

---

### `ClayItem( [Object] config )`

#### Properties

| Property | Type | Description
| ---
| `.id` | String | The ID of the item if provided in the config.
| `.appKey` | String | The ID of the item if provided in the config.
| `.config` | Object | Reference to the config passed to the constructer. 
| `$element` | $Minified | A Minified list representing the root HTML element of the config item
| `$manipulatorTarget` | A Minified list representing the HTML element with **data-manipulator-target** set. This is generally pointing to the main `<input>` element and will be used for binding events. 


#### Methods

| Method | Returns 
| ---
| `.initialize( [ClayConfig] clay)` <br> You shouldn't ever need to run this method manually as it will automatically be called when the config is built | `ConfigItem`
| `.on( [string] events, [function] handler )` <br> Register an event to the provided handler. The handler will be called with this instance of `ClayItem` as the context. If you wish to register multiple events to the same handler, then separate the events with a space. Events will be registered against the `$manipulatorTarget` so most DOM events such as **"change"** or **"click"** can be listened for. | `ClayItem`
| `.off( [function] handler )` <br> Remove the given event handler. **NOTE:** This will remove the handler from all registered events | `ClayItem`
| `.trigger( [string] name, [object] eventObj={} )` <br> Trigger the provided event and optionally pass extra data to the handler. | `ClayItem`

In addition to the methods above, all the methods from the item's manipulator will be attached to the `CLayItem`. This includes `.set()` and `.get()`

---

## Custom Components

Clay is also able to be extended using custom components. This allows developers to share components with each other. 

### Component Structure

Components are simple objects with the following properties:

#### `ClayComponent`

| Property | Type | Required | Description 
|---
| name | string | yes | This is the unique way to identify the component and what will be used by the config item's `type` 
| template | string (HTML) | yes | This is the actual HTML content of the component. Make sure there is only **one** root node in the HTML. This HTML will be passed to minified's `HTML()` method. Any properties provided by the config item will be made available to the template, eg: `label`. The template will also be provided with `clayId` as a unique way to set input `name` attributes. 
| style | string | no | Any extra css styles you want to inject into the page make sure to namespace your CSS with a class that is unique to your component in order to avoid conflicts with other components 
| manipulator | string / manipulator | yes | Provide a string here to use one of the built-in manipulators. eg `val`. If an object is provided, it must have both a `.set(value)` and `.get()` method. 
| defaults | object | Only if your template requires it | An object of all the defaults your template requires.
| initialize | function | no | Method which will be called after the item has been added to the page. It will be called with the `ClayItem` as the context (`this`) and with `minified` as the first parameter.

### Registering a custom component. 

Components must be registered before the config page is built. The easiest way to do this is in your `app.js` after you have initialized Clay 

```javascript
var Clay = require('clay');
var clayConfig = require('config.json');
var clay = new Clay(clayConfig);

clay.registerComponent(require('./my-custom-component'));
```

## Minified

Minified is a super light JQuery-like library. We only bundle in a small subset of its functionality. Visit the [Minified Docs](http://minifiedjs.com/api/) for more info on how to use minified. Below is the subset of methods available. 

 - `$()`
 - `$$()`
 - `.get()`
 - `.select()`
 - `.set()`
 - `.add()`
 - `.ht()`
 - `HTML()`
 - `$.request()`
 - `promise.always()`
 - `promise.error()`
 - `$.off()`
 - `$.ready()`
 - `$.wait()`
 - `.on()`
 - `.each()`
 - `.find()`
 - `_()`
 - `_.copyObj()`
 - `_.eachObj()`
 - `_.extend()`
 - `_.format()`
 - `_.formatHtml()`
 - `_.template()`
 - `_.isObject()`

# Project Structure and Development 

There are two main entry points for Clay. `index.js` and `src/scripts/config-page.js`. 

#### index.js

This is the main entry point for the code that will run in the Pebble app's `src/js/app.js`. It is responsible for serializing the provided config into a data URI that will be opened using `Pebble.openURL()`. It also persists data to local storage. 

#### src/scripts/config-page.js

This is the main entry point for the code that runs on the generated config page. It is its responsibility to pass the injected config and other components to the `ClayConfig` class. 


### Building 

There are two ways to build Clay, production mode and development mode. 

#### Production Mode

`$ npm run build` packages up the entire Clay project into `dist/clay.js` to be required in the developer's `app.js`

#### Development Mode

`$ npm run dev` packages up `src/scripts/config-page.js` and `dev/dev.js` into the `tmp/` directory so `dev/dev.html` can include them as script tags. This will also watch for changes in the project. 

While developing components and other functionality for Clay, it is much easier to work with the files in the `dev/` directory than on a phone or emulator. Below is an explanation of the files and their purpose 

| File | Purpose 
|----------|------
| `dev.html` | open this page in a browser after running `$ npm run dev`
| `dev.js` | injects the components and dependancies things into the window the same way `index.js` would. 
| `config.js` | Clay config to use as a sandbox for testing components.
| `custom-fn.js` | Clay custom function to be injected by `dev.js`
| `emulator.html` | Copy of the html page that is used to make the Pebble SDK emulator play nice with Clay
| `uri-test.html` | Used to stress test URI creation for older browser versions. 

## Functionality

Most of the magic happens in the `src/scripts/lib` directory. `config-page.js` initializes a new instance of `ClayConfig` and calls the injected custom function (`window.customFn`) with the ClayConfig as its context. This allows developers to add extra functionality to the config page, such as setting values of items dynamically or registering small custom components. 

Once the `ClayConfig` is initialized, we run the `.build()` method. This iterates over the config and injects each item into the page. Each item is an instance of ClayItem. It also indexes the items to later be retrieved with `.getAllItems()`, `.getItemByAppKey()`, `.getItemById()`, `.getItemsByType()`








