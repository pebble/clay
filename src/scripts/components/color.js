'use strict';

module.exports = {
  name: 'color',
  template: require('../../templates/components/color.tpl'),
  style: require('../../styles/clay/components/color.scss'),
  manipulator: 'color',
  defaults: {
    label: '',
    description: ''
  },
  initialize: function(minified, clay) {
    var HTML = minified.HTML;
    var self = this;

    /**
     * @param {string|boolean|number} color
     * @returns {string}
     */
    function cssColor(color) {
      if (typeof color === 'number') {
        color = color.toString(16);
      } else if (!color) {
        return 'transparent';
      }

      color = padColorString(color);

      return '#' + (useSunlight ? sunlightColorMap[color] : color);
    }

    /**
     * @param {string} color
     * @return {string}
     */
    function padColorString(color) {
      color = color.toLowerCase();

      while (color.length < 6) {
        color = '0' + color;
      }

      return color;
    }

    /**
     * @param {number|string} value
     * @returns {string|*}
     */
    function normalizeColor(value) {
      switch (typeof value) {
        case 'number': return padColorString(value.toString(16));
        case 'string': return value.replace(/^#|^0x/, '');
        default: return value;
      }
    }

    /**
     * @param {Array.<Array>} layout
     * @returns {Array}
     */
    function flattenLayout(layout) {
      return layout.reduce(function(a, b) {
        return a.concat(b);
      }, []);
    }

    /**
     * Convert HEX color to LAB.
     * Adapted from: https://github.com/antimatter15/rgb-lab
     * @param {string} hex
     * @returns {Array} - [l, a, b]
     */
    function hex2lab(hex) {
      hex = hex.replace(/^#|^0x/, '');

      var r = parseInt(hex.slice(0, 2), 16) / 255;
      var g = parseInt(hex.slice(2, 4), 16) / 255;
      var b = parseInt(hex.slice(4), 16) / 255;

      r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
      g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
      b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

      var x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
      var y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
      var z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

      x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
      y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
      z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;

      return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)];
    }

    /**
     * Find the perceptual color distance between two LAB colors
     * @param {Array} labA
     * @param {Array} labB
     * @returns {number}
     */
    function deltaE(labA, labB) {
      var deltaL = labA[0] - labB[0];
      var deltaA = labA[1] - labB[1];
      var deltaB = labA[2] - labB[2];

      return Math.sqrt(Math.pow(deltaL, 2) +
                       Math.pow(deltaA, 2) +
                       Math.pow(deltaB, 2));
    }

    /**
     * Returns the layout based on the connected watch
     * @returns {Array}
     */
    function autoLayout() {
      if (!clay.meta.activeWatchInfo ||
          clay.meta.activeWatchInfo.firmware.major === 2 ||
          ['aplite', 'diorite'].indexOf(clay.meta.activeWatchInfo.platform) > -1 &&
          !self.config.allowGray) {
        return standardLayouts.BLACK_WHITE;
      }

      if (['aplite', 'diorite'].indexOf(clay.meta.activeWatchInfo.platform) > -1 &&
          self.config.allowGray) {
        return standardLayouts.GRAY;
      }

      return standardLayouts.COLOR;
    }

    /**
     * @param {number|string} color
     * @return {number}
     */
    self.roundColorToLayout = function(color) {
      var itemValue = normalizeColor(color);

      // if the color is not in the layout we will need find the closest match
      if (colorList.indexOf(itemValue) === -1) {
        var itemValueLAB = hex2lab(itemValue);
        var differenceArr = colorList.map(function(color) {
          var colorLAB = hex2lab(normalizeColor(color));
          return deltaE(itemValueLAB, colorLAB);
        });

        // Get the lowest number from the differenceArray
        var lowest = Math.min.apply(Math, differenceArr);

        // Get the index for that lowest number
        var index = differenceArr.indexOf(lowest);
        itemValue = colorList[index];
      }

      return parseInt(itemValue, 16);
    };

    var useSunlight = self.config.sunlight !== false;
    var sunlightColorMap = {
      '000000': '000000', '000055': '001e41', '0000aa': '004387', '0000ff': '0068ca',
      '005500': '2b4a2c', '005555': '27514f', '0055aa': '16638d', '0055ff': '007dce',
      '00aa00': '5e9860', '00aa55': '5c9b72', '00aaaa': '57a5a2', '00aaff': '4cb4db',
      '00ff00': '8ee391', '00ff55': '8ee69e', '00ffaa': '8aebc0', '00ffff': '84f5f1',
      '550000': '4a161b', '550055': '482748', '5500aa': '40488a', '5500ff': '2f6bcc',
      '555500': '564e36', '555555': '545454', '5555aa': '4f6790', '5555ff': '4180d0',
      '55aa00': '759a64', '55aa55': '759d76', '55aaaa': '71a6a4', '55aaff': '69b5dd',
      '55ff00': '9ee594', '55ff55': '9de7a0', '55ffaa': '9becc2', '55ffff': '95f6f2',
      'aa0000': '99353f', 'aa0055': '983e5a', 'aa00aa': '955694', 'aa00ff': '8f74d2',
      'aa5500': '9d5b4d', 'aa5555': '9d6064', 'aa55aa': '9a7099', 'aa55ff': '9587d5',
      'aaaa00': 'afa072', 'aaaa55': 'aea382', 'aaaaaa': 'ababab', 'ffffff': 'ffffff',
      'aaaaff': 'a7bae2', 'aaff00': 'c9e89d', 'aaff55': 'c9eaa7', 'aaffaa': 'c7f0c8',
      'aaffff': 'c3f9f7', 'ff0000': 'e35462', 'ff0055': 'e25874', 'ff00aa': 'e16aa3',
      'ff00ff': 'de83dc', 'ff5500': 'e66e6b', 'ff5555': 'e6727c', 'ff55aa': 'e37fa7',
      'ff55ff': 'e194df', 'ffaa00': 'f1aa86', 'ffaa55': 'f1ad93', 'ffaaaa': 'efb5b8',
      'ffaaff': 'ecc3eb', 'ffff00': 'ffeeab', 'ffff55': 'fff1b5', 'ffffaa': 'fff6d3'
    };

    /* eslint-disable  comma-spacing, no-multi-spaces, max-len,
     standard/array-bracket-even-spacing */
    var standardLayouts = {
      COLOR: [
        [false   , false   , '55ff00', 'aaff55', false   , 'ffff55', 'ffffaa', false   , false   ],
        [false   , 'aaffaa', '55ff55', '00ff00', 'aaff00', 'ffff00', 'ffaa55', 'ffaaaa', false   ],
        ['55ffaa', '00ff55', '00aa00', '55aa00', 'aaaa55', 'aaaa00', 'ffaa00', 'ff5500', 'ff5555'],
        ['aaffff', '00ffaa', '00aa55', '55aa55', '005500', '555500', 'aa5500', 'ff0000', 'ff0055'],
        [false   , '55aaaa', '00aaaa', '005555', 'ffffff', '000000', 'aa5555', 'aa0000', false   ],
        ['55ffff', '00ffff', '00aaff', '0055aa', 'aaaaaa', '555555', '550000', 'aa0055', 'ff55aa'],
        ['55aaff', '0055ff', '0000ff', '0000aa', '000055', '550055', 'aa00aa', 'ff00aa', 'ffaaff'],
        [false   , '5555aa', '5555ff', '5500ff', '5500aa', 'aa00ff', 'ff00ff', 'ff55ff', false   ],
        [false   , false   , false   , 'aaaaff', 'aa55ff', 'aa55aa', false   , false   , false   ]
      ],
      GRAY: [
        ['000000', 'aaaaaa', 'ffffff']
      ],
      BLACK_WHITE: [
        ['000000', 'ffffff']
      ]
    };
    /* eslint-enable */

    var layout = self.config.layout || autoLayout();

    if (typeof layout === 'string') {
      layout = standardLayouts[layout];
    }

    // make sure layout is a 2D array
    if (!Array.isArray(layout[0])) {
      layout = [layout];
    }

    var colorList = flattenLayout(layout).map(function(item) {
      return normalizeColor(item);
    }).filter(function(item) {
      return item;
    });

    var grid = '';
    var rows = layout.length;
    var cols = 0;
    layout.forEach(function(row) {
      cols = row.length > cols ? row.length : cols;
    });
    var itemWidth = 100 / cols;
    var itemHeight = 100 / rows;
    var $elem = self.$element;

    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {

        var color = normalizeColor(layout[i][j]);
        var selectable = (color ? ' selectable' : '');

        var roundedTL = (i === 0 && j === 0) || i === 0 && !layout[i][j - 1] ||
                        !layout[i][j - 1] && !layout[i - 1][j] ?
          ' rounded-tl' :
          '';

        var roundedTR = i === 0 && !layout[i][j + 1] ||
                        !layout[i][j + 1] && !layout[i - 1][j] ?
          ' rounded-tr ' :
          '';

        var roundedBL = (i === layout.length - 1 && j === 0) ||
                        i === layout.length - 1 && !layout[i][j - 1] ||
                        !layout[i][j - 1] && !layout[i + 1][j] ?
          ' rounded-bl' :
          '';

        var roundedBR = i === layout.length - 1 && !layout[i][j + 1] ||
                        !layout[i][j + 1] && !layout[i + 1][j] ?
          ' rounded-br' :
          '';

        grid += '<i ' +
          'class="color-box ' + selectable + roundedTL + roundedTR + roundedBL +
              roundedBR + '" ' +
          (color ? 'data-value="' + parseInt(color, 16) + '" ' : '') +
          'style="' +
            'width:' + itemWidth + '%; ' +
            'height:' + itemHeight + '%; ' +
            'background:' + cssColor(color) + ';">' +
        '</i>';
      }
    }

    // on very small layouts the boxes end up huge. The following adds extra padding
    // to prevent them from being so big.
    var extraPadding = 0;
    if (cols === 3) {
      extraPadding = 5;
    }
    if (cols === 2) {
      extraPadding = 8;
    }
    var vPadding = (extraPadding * itemWidth / itemHeight) + '%';
    var hPadding = extraPadding + '%';
    $elem.select('.color-box-container')
      .add(HTML(grid))
      .set('$paddingTop', vPadding)
      .set('$paddingRight', hPadding)
      .set('$paddingBottom', vPadding)
      .set('$paddingLeft', hPadding);

    $elem.select('.color-box-wrap').set(
      '$paddingBottom',
      (itemWidth / itemHeight * 100) + '%'
    );

    var $valueDisplay = $elem.select('.value');
    var $picker = $elem.select('.picker-wrap');
    var disabled = self.$manipulatorTarget.get('disabled');

    $elem.select('label').on('click', function() {
      if (!disabled) {
        $picker.set('show'); // toggle visibility
      }
    });

    self.on('change', function() {
      var value = self.get();
      $valueDisplay.set('$background-color', cssColor(value));
      $elem.select('.color-box').set('-selected');
      $elem.select('.color-box[data-value="' + value + '"]').set('+selected');
    });

    $elem.select('.color-box.selectable').on('click', function(ev) {
      self.set(parseInt(ev.target.dataset.value, 10));
      $picker.set('-show');
    });

    $picker.on('click', function() {
      $picker.set('-show');
    });

    self.on('disabled', function() {
      disabled = true;
    });

    self.on('enabled', function() {
      disabled = false;
    });

    // expose layout for testing
    self._layout = layout;
  }
};
