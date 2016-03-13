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

      color = color.toLowerCase();

      while (color.length < 6) {
        color = '0' + color;
      }

      return '#' + (useSunlight ? sunlightColorMap[color] : color);
    }

    /**
     * @param {number|string} value
     * @returns {string|*}
     */
    function normalizeColor(value) {
      switch (typeof value) {
        case 'number': return value.toString(16);
        case 'string': return value.replace(/^#|^0x/, '');
        default: return value;
      }
    }

    /**
     * Returns the layout based on the connected watch
     * @returns {Array}
     */
    function autoLayout() {
      if (!clay.meta.activeWatchInfo ||
          clay.meta.activeWatchInfo.firmware.major === 2 ||
          clay.meta.activeWatchInfo.platform === 'aplite' &&
          !self.config.allowGray) {
        return standardLayouts.BLACK_WHITE;
      }

      if (clay.meta.activeWatchInfo.platform === 'aplite' && self.config.allowGray) {
        return standardLayouts.GRAY;
      }

      return standardLayouts.COLOR;
    }

    var HTML = minified.HTML;
    var self = this;
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
