'use strict';

var HTML = require('../vendor/minified/minified').HTML;

module.exports = {
  name: 'color',
  template: require('../../templates/components/color.tpl'),
  manipulator: require('../lib/manipulators').val,
  defaults: {
    label: ''
  },
  initialize: function() {
    var self = this;

    /* eslint-disable  comma-spacing, no-multi-spaces, max-len,
        standard/array-bracket-even-spacing */
    var layout = self.config.layout || [
      [false    , false    , '#55FF00', '#AAFF55', false    , '#FFFF55', '#FFFFAA', false    , false    ],
      [false    , '#AAFFAA', '#55FF55', '#00FF00', '#AAFF00', '#FFFF00', '#FFAA55', '#FFAAAA', false    ],
      ['#55FFAA', '#00FF55', '#00AA00', '#55AA00', '#AAAA55', '#AAAA00', '#FFAA00', '#FF5500', '#FF5555'],
      ['#AAFFFF', '#00FFAA', '#00AA55', '#55AA55', '#005500', '#555500', '#AA5500', '#FF0000', '#FF0055'],
      [false    , '#55AAAA', '#00AAAA', '#005555', '#FFFFFF', '#000000', '#AA5555', '#AA0000', false    ],
      ['#55FFFF', '#00FFFF', '#00AAFF', '#0055AA', '#AAAAAA', '#555555', '#550000', '#AA0055', '#FF55AA'],
      ['#55AAFF', '#0055FF', '#0000FF', '#0000AA', '#000055', '#550055', '#AA00AA', '#FF00AA', '#FFAAFF'],
      [false    , '#5555AA', '#5555FF', '#5500FF', '#5500AA', '#AA00FF', '#FF00FF', '#FF55FF', false    ],
      [false    , false    , false    , '#AAAAFF', '#AA55FF', '#AA55AA', false    , false    , false    ]
    ];
    /* eslint-enable */

    var grid = '';
    var itemWidth = 100 / layout[0].length;
    var itemHeight = 100 / layout.length;
    var $elem = self.$element;

    for (var i = 0; i < layout.length; i++) {
      for (var j = 0; j < layout[i].length; j++) {

        var color = layout[i][j] || 'transparent';
        var selectable = (color !== 'transparent' ? ' selectable' : '');

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
          'data-value="' + color.replace(/^#/, '0x').toLowerCase() + '" ' +
          'style="' +
            'width:' + itemWidth + '%; ' +
            'height:' + itemHeight + '%; ' +
            'background:' + color + ';">' +
        '</i>';
      }
    }

    $elem.select('.color-box-container').add(HTML(grid));

    var $valueDisplay = $elem.select('.value');
    var $picker = $elem.select('.picker-wrap');
    var disabled = self.$manipulatorTarget.get('disabled');

    $elem.on('click', function(ev) {
      if (!disabled) {
        $picker.set('show');
      }
    });

    self.on('change', function() {
      var value = self.get().replace(/^0x/, '').toLowerCase();
      $valueDisplay.set('$background-color', '#' + value);
      $elem.select('.color-box').set('-selected');
      $elem.select('.color-box[data-value="0x' + value + '"]').set('+selected');
    });

    $elem.select('.color-box.selectable').on('click', function(ev) {
      self.set(ev.target.dataset.value);
      $picker.set('-show');
    });

    self.on('disabled', function() {
      disabled = true;
    });

    self.on('enabled', function() {
      disabled = false;
    });

  }
};
