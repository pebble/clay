Slate
=====

![Bower](https://img.shields.io/bower/v/pebble-slate.svg)

Slate is a front-end framework for developing Pebble mobile configuration pages.
It's the fastest way to make a clean UI for a Pebble app's mobile configuration
page.

![screenshot](https://raw.githubusercontent.com/pebble/slate/master/docs/assets/screenshot.png)

Getting Started
---------------

### Getting Slate

There are only four files that makeup the Slate framework, a CSS file and a
JavaScript file, and two fonts.

There are two quick ways to getting started with Slate.

#### Via Download

The CSS and JS files and fonts are also available via download.

[Download Slate 0.0.3 >](https://github.com/pebble/slate/archive/v0.0.3.zip)

#### Via Bower

The CSS and JS files and fonts are also avaliable via Bower.

```bash
bower install pebble-slate
```

### Zepto.js

Slate is also bundled with [Zepto.js](https://github.com/madrobby/zepto), which
is "a minimalist JavaScript library for modern browsers with a largely
jQuery-compatible API."

Video Tutorial
--------------

A detailed live demo tutorial was given at the Pebble SF Meetup, and can be
watched in full below.

[![IMAGE ALT TEXT HERE](http://img.youtube.com/vi/TtP7z6wceqI/0.jpg)](http://www.youtube.com/watch?v=TtP7z6wceqI)

Additionally, the example app used in the video 
[can be found here](https://github.com/pebble-hacks/slate-watchface-template), 
while a second example implementation 
[can be found here](https://github.com/pebble-examples/slate-config-example).

Documentation
-------------

Here is a list of the different components you can create with Slate.

### Paragraphs

![paragraph](https://raw.githubusercontent.com/pebble/slate/master/docs/assets/slate-paragraph.png)

```html
<div class="item-container">
  <div class="item-container-content">
    <div class="item">
      Abilities or he perfectly pretended so strangers be exquisite. Oh to
      another chamber pleased imagine do in. Went me rank at last loud shot an
      draw. Excellent so to no sincerity smallness. Removal request delight if
      on he we. Unaffected in we by apartments astonished to decisively
      themselves. Offended ten old consider speaking.
    </div>
  </div>
</div>
```

### Headers, Footers, and Items

![header, footer, and item](https://raw.githubusercontent.com/pebble/slate/master/docs/assets/slate-header-content-footer.png)

```html
<div class="item-container">
  <div class="item-container-header">Single Item</div>
  <div class="item-container-content">
    <label class="item">
      Example Item
      <input type="checkbox" class="item-toggle" name="toggle-1" checked>
    </label>
  </div>
  <div class="item-container-footer">
    Comfort reached gay perhaps chamber his six detract besides add. Moonlight
    newspaper up he it enjoyment agreeable depending. Timed
    <a href="#">voice share</a> led his widen noisy young.
  </div>
</div>
```

### Toggles and Selects

![toggles and select](https://raw.githubusercontent.com/pebble/slate/master/docs/assets/slate-toggle.png)

```html
<div class="item-container">
  <div class="item-container-header">Multiple Items</div>
  <div class="item-container-content">
    <label class="item">
      Example Item
      <input type="checkbox" class="item-toggle" name="toggle-2" checked>
    </label>
    <label class="item">
      Example Item
      <input type="checkbox" class="item-toggle" name="toggle-3">
    </label>
    <label class="item">
      Example Item
      <select name="select-1" dir='rtl' class="item-select">
        <option class="item-select-option">Both</option>
        <option class="item-select-option" selected>Major only</option>
        <option class="item-select-option">Minor only</option>
      </select>
    </label>
  </div>
</div>
```

### Checkboxes

![checkboxes](https://raw.githubusercontent.com/pebble/slate/master/docs/assets/slate-checkbox.png)

```html
<div class="item-container">
  <div class="item-container-header">Checkboxes</div>
  <div class="item-container-content">
    <label class="item">
      Example Item
      <input type="checkbox" class="item-checkbox" name="checkbox-1">
    </label>
    <label class="item">
      Example Item
      <input type="checkbox" class="item-checkbox" name="checkbox-2" checked>
    </label>
  </div>
</div>
```

### Radio Buttons

![radio buttons](https://raw.githubusercontent.com/pebble/slate/master/docs/assets/slate-radio.png)

```html
<div class="item-container">
  <div class="item-container-header">Radio Buttons</div>
  <div class="item-container-content">
    <label class="item">
      Example Item
      <input type="radio" class="item-radio" name="radio-1" value="a">
    </label>
    <label class="item">
      Example Item
      <input type="radio" class="item-radio" name="radio-1" value="b">
    </label>
    <label class="item">
      Example Item
      <input type="radio" class="item-radio" name="radio-1" value="c" checked>
    </label>
  </div>
</div>
```

### Date, Time, and Colorpickers

![date, time, and colorpickers](https://raw.githubusercontent.com/pebble/slate/master/docs/assets/slate-date-time-colorpickers.png)

```html
<div class="item-container">
  <div class="item-container-header">Date, Time, Colorpickers</div>
  <div class="item-container-content">
    <label class="item">
      Example Item
      <input type="time" class="item-time" name="time-1" value="18:35">
    </label>
    <label class="item">
      Example Item
      <input type="date" class="item-date" name="date-1" value="2015-02-12">
    </label>
     <label class="item">
      Normal Color Picker
      <input type="text" class="item-color item-color-normal" name="color-1" value="#000000">
    </label>
    <label class="item">
      Sunny Color Picker
      <input type="text" class="item-color item-color-sunny" name="color-2" value="#000000">
    </label>
  </div>
</div>
```

### Input Fields

![input field](https://raw.githubusercontent.com/pebble/slate/master/docs/assets/slate-input.png)

```html
<div class="item-container">
  <div class="item-container-header">Input Field</div>
  <div class="item-container-content">
    <label class="item">
      <div class="item-input-wrapper">
        <input type="text" class="item-input" name="input-1" placeholder="Input field">
      </div>
    </label>
  </div>
</div>
```

### Input Fields with Buttons

![input field with button](https://raw.githubusercontent.com/pebble/slate/master/docs/assets/slate-input-button.png)

```html
<div class="item-container">
  <div class="item-container-header">Input Field + Send Button</div>
  <div class="item-container-content">
    <label class="item">
      <div class="item-input-wrapper item-input-wrapper-button">
        <input type="text" class="item-input" name="input-2" placeholder="Input field">
      </div>
      <input type="button" class="item-button item-input-button" value="SEND">
    </label>
  </div>
</div>
```

### Tab Buttons

![tab buttons](https://raw.githubusercontent.com/pebble/slate/master/docs/assets/slate-tab-button.png)

```html
<div class="item-container">
  <div class="item-container-header">Tab Buttons</div>
  <div class="item-container-content">
    <div class="item tab-buttons">
      <a name="tab-1" class="tab-button active">Both</a>
      <a name="tab-1" class="tab-button">Celcius</a>
      <a name="tab-1" class="tab-button">Fahrenheit</a>
    </div>
  </div>
</div>
```

### Sliders

![slider](https://raw.githubusercontent.com/pebble/slate/master/docs/assets/slate-slider.png)

```html
<div class="item-container">
  <div class="item-container-header">Slider</div>
  <div class="item-container-content">
    <label class="item">
      <input type="range" class="item-slider" name="slider-1" value="50">
      <div class="item-input-wrapper item-slider-text">
        <input type="text" class="item-input" name="slider-1" value="50">
      </div>
    </label>
  </div>
</div>
```

### Draggable Lists

![draggable list](https://raw.githubusercontent.com/pebble/slate/master/docs/assets/slate-draggable.png)

```html
<div class="item-container">
  <div class="item-container-header">draggable Items</div>
  <div class="item-container-content">
    <div class="item-draggable-list">
      <label class="item">Example Item 1</label>
      <label class="item">Example Item 2</label>
      <label class="item">Example Item 3</label>
    </ul>
  </div>
</div>
```

### Lists

![list](https://raw.githubusercontent.com/pebble/slate/master/docs/assets/slate-list.png)

```html
<div class="item-container">
  <div class="item-container-header">Item List</div>
  <div class="item-container-content">
    <div class="item-dynamic-list">
      <label class="item">Example Item A</label>
      <label class="item">Example Item B</label>
    </div>
  </div>
</div>
```

### Buttons

![button](https://raw.githubusercontent.com/pebble/slate/master/docs/assets/slate-button.png)

```html
<div class="item-container">
  <div class="button-container">
    <input type="button" class="item-button" value="SEND">
  </div>
</div>
```
