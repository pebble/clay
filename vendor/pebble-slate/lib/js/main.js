'use strict';

(function($, Sortable) {

  var ENUMS = {
    COLOR : {
      EMPTY: 'transparent'
    }
  }

  $.extend($.fn, {
    itemToggle: function() {
      this.each(function() {
        var $checkbox = $(this);
        var item = $checkbox.parent();

        var $injectedCheckbox = $('<div class="item-styled-toggle-wrapper">'
                                 + '<div class="item-styled-toggle">'
                                   + '<div class="item-styled-toggle-bar"></div>'
                                   + '<div class="item-styled-toggle-bar"></div>'
                                   + '<div class="item-styled-toggle-bar"></div>'
                                 + '</div>'
                               + '</div>');

        item.append($injectedCheckbox);
      });
    },

    itemCheckbox: function() {
      this.each(function() {
        var $checkbox = $(this);
        var item = $checkbox.parent();

        var $injectedCheckbox = $('<div class="item-styled-checkbox"></div>');

        item.append($injectedCheckbox);
      });
    },

    itemSelect: function() {
      this.each(function() {
        var $select = $(this);
        var $item = $select.parent();

        $item.append('<div class="select-triangle"></div>');
      });
    },

    itemDate: function() {
      this.each(function() {
        var $date = $(this);
        var $item = $date.parent();

        var $injectedDate = $('<div class="item-styled-date"></div>');
        updateDate();

        $item.append($injectedDate);

        $date.change(function() {
          updateDate();
        });

        function updateDate() {
          $injectedDate.html($date.val());
        }
      });
    },

    itemTime: function() {
      this.each(function() {
        var $time = $(this);
        var $item = $time.parent();

        var $injectedTime = $('<div class="item-styled-time"></div>');
        updateTime();

        $item.append($injectedTime);

        $time.change(function() {
          updateTime();
        });

        function updateTime() {
          $injectedTime.html($time.val());
        }
      });
    },

    itemRadio: function() {
      this.each(function() {
        var $radio = $(this);
        var $item  = $radio.parent();

        var $injectedRadio = $('<div class="item-styled-radio"></div>');

        $item.append($injectedRadio);
      });
    },

    itemColor: function(options){

      var options = $.extend({}, {
        sunny: false
      }, options || {});

      var layout = [
        [false    , false    , '#55FF00', '#AAFF55', false    , '#FFFF55', '#FFFFAA', false    , false    ],
        [false    , '#AAFFAA', '#55FF55', '#00FF00', '#AAFF00', '#FFFF00', '#FFAA55', '#FFAAAA', false    ],
        ['#55FFAA', '#00FF55', '#00AA00', '#55AA00', '#AAAA55', '#AAAA00', '#FFAA00', '#FF5500', '#FF5555'],
        ['#AAFFFF', '#00FFAA', '#00AA55', '#55AA55', '#005500', '#555500', '#AA5500', '#FF0000', '#FF0055'],
        [false    , '#55AAAA', '#00AAAA', '#005555', '#FFFFFF', '#000000', '#AA5555', '#AA0000', false    ],
        ['#55FFFF', '#00FFFF', '#00AAFF', '#0055AA', '#AAAAAA', '#555555', '#550000', '#AA0055', '#FF55AA'],
        ['#55AAFF', '#0055FF', '#0000FF', '#0000AA', '#000055', '#550055', '#AA00AA', '#FF00AA', '#FFAAFF'],
        [false    , '#5555AA', '#5555FF', '#5500FF', '#5500AA', '#AA00FF', '#FF00FF', '#FF55FF', false    ],
        [false    , false    , false    , '#AAAAFF', '#AA55FF', '#AA55AA', false    , false    , false    ],
      ];

      var mappingSunny = {'000000': '000000','000055': '001e41','0000aa': '004387',
                          '0000ff': '0068ca','005500': '2b4a2c','005555': '27514f',
                          '0055aa': '16638d','0055ff': '007dce','00aa00': '5e9860',
                          '00aa55': '5c9b72','00aaaa': '57a5a2','00aaff': '4cb4db',
                          '00ff00': '8ee391','00ff55': '8ee69e','00ffaa': '8aebc0',
                          '00ffff': '84f5f1','550000': '4a161b','550055': '482748',
                          '5500aa': '40488a','5500ff': '2f6bcc','555500': '564e36',
                          '555555': '545454','5555aa': '4f6790','5555ff': '4180d0',
                          '55aa00': '759a64','55aa55': '759d76','55aaaa': '71a6a4',
                          '55aaff': '69b5dd','55ff00': '9ee594','55ff55': '9de7a0',
                          '55ffaa': '9becc2','55ffff': '95f6f2','aa0000': '99353f',
                          'aa0055': '983e5a','aa00aa': '955694','aa00ff': '8f74d2',
                          'aa5500': '9d5b4d','aa5555': '9d6064','aa55aa': '9a7099',
                          'aa55ff': '9587d5','aaaa00': 'afa072','aaaa55': 'aea382',
                          'aaaaaa': 'ababab','ffffff': 'ffffff','aaaaff': 'a7bae2',
                          'aaff00': 'c9e89d','aaff55': 'c9eaa7','aaffaa': 'c7f0c8',
                          'aaffff': 'c3f9f7','ff0000': 'e35462','ff0055': 'e25874',
                          'ff00aa': 'e16aa3','ff00ff': 'de83dc','ff5500': 'e66e6b',
                          'ff5555': 'e6727c','ff55aa': 'e37fa7','ff55ff': 'e194df',
                          'ffaa00': 'f1aa86','ffaa55': 'f1ad93','ffaaaa': 'efb5b8',
                          'ffaaff': 'ecc3eb','ffff00': 'ffeeab','ffff55': 'fff1b5',
                          'ffffaa': 'fff6d3'};

      var mappingNormal = {'000000': '000000','001e41': '000055','004387': '0000aa',
                          '0068ca': '0000ff','2b4a2c': '005500','27514f': '005555',
                          '16638d': '0055aa','007dce': '0055ff','5e9860': '00aa00',
                          '5c9b72': '00aa55','57a5a2': '00aaaa','4cb4db': '00aaff',
                          '8ee391': '00ff00','8ee69e': '00ff55','8aebc0': '00ffaa',
                          '84f5f1': '00ffff','4a161b': '550000','482748': '550055',
                          '40488a': '5500aa','2f6bcc': '5500ff','564e36': '555500',
                          '545454': '555555','4f6790': '5555aa','4180d0': '5555ff',
                          '759a64': '55aa00','759d76': '55aa55','71a6a4': '55aaaa',
                          '69b5dd': '55aaff','9ee594': '55ff00','9de7a0': '55ff55',
                          '9becc2': '55ffaa','95f6f2': '55ffff','99353f': 'aa0000',
                          '983e5a': 'aa0055','955694': 'aa00aa','8f74d2': 'aa00ff',
                          '9d5b4d': 'aa5500','9d6064': 'aa5555','9a7099': 'aa55aa',
                          '9587d5': 'aa55ff','afa072': 'aaaa00','aea382': 'aaaa55',
                          'ababab': 'aaaaaa','ffffff': 'ffffff','a7bae2': 'aaaaff',
                          'c9e89d': 'aaff00','c9eaa7': 'aaff55','c7f0c8': 'aaffaa',
                          'c3f9f7': 'aaffff','e35462': 'ff0000','e25874': 'ff0055',
                          'e16aa3': 'ff00aa','de83dc': 'ff00ff','e66e6b': 'ff5500',
                          'e6727c': 'ff5555','e37fa7': 'ff55aa','e194df': 'ff55ff',
                          'f1aa86': 'ffaa00','f1ad93': 'ffaa55','efb5b8': 'ffaaaa',
                          'ecc3eb': 'ffaaff','ffeeab': 'ffff00','fff1b5': 'ffff55',
                          'fff6d3': 'ffffaa'};

      this.each(function() {
        var $color = $(this);
        var $item = $color.parent();
        var grid = '';
        var itemWidth = 100 / layout[0].length;
        var itemHeight = 100 / layout.length;
        var boxHeight = itemWidth * layout.length;

        for(var i = 0; i < layout.length; i++) {
          for(var j = 0; j < layout[i].length; j++) {

            var color = layout[i][j] || ENUMS.COLOR.EMPTY;
            var selectable = (color !== ENUMS.COLOR.EMPTY ? ' selectable' : '');

            var roundedTL = (i === 0 && j === 0)
                || i === 0 && !layout[i][j - 1]
                || !layout[i][j - 1] && !layout[i -1][j]
                    ? ' rounded-tl' : '';

            var roundedTR = i === 0 && !layout[i][j + 1]
                || !layout[i][j + 1] && !layout[i -1][j]
                    ? ' rounded-tr ' : '';

            var roundedBL = (i === layout.length - 1 && j === 0)
                || i === layout.length - 1 && !layout[i][j - 1]
                || !layout[i][j - 1] && !layout[i + 1][j]
                    ? ' rounded-bl' : '';

            var roundedBR = i === layout.length - 1 && !layout[i][j + 1]
                || !layout[i][j + 1] && !layout[i + 1][j]
                    ? ' rounded-br' : '';

            if(options.sunny && color !== ENUMS.COLOR.EMPTY) {
              color = '#' + mappingSunny[color.replace('#', '').toLowerCase()];
            }

            grid += '<i ' +
              'class="color-box ' + selectable + roundedTL +
                      roundedTR + roundedBL + roundedBR + '" ' +
              'data-value="' + color.replace(/^#/, '0x') + '" ' +
              'style="' +
                'width:' + itemWidth + '%; ' +
                'height:' + itemHeight + '%; ' +
                'background:' + color + ';">' +
            '</i>';
          }
        }

        var $injectedColor = $('<div class="item-styled-color">' +
          '<span class="value" style="background:' + $color.val().replace(/^0x/, '#') + '"></span>' +
          '<div ' +
              'style="padding-bottom:' + boxHeight + '%"' +
              'class="color-box-wrap">' +
            '<div class="color-box-container">' +
                grid +
            '</div>' +
          '</div>' +
        '</div>');
        $item.append($injectedColor);

        var $valueDisplay = $injectedColor.find('.value');

        $color.on('click', function(ev) {
          $item.find('.color-box-wrap').toggleClass('show');
        });

        $color.on('change', function(ev) {
          var value = $(this).val().replace(/^0x/, '').toLowerCase();
          if(options.sunny) {
            value = mappingSunny[value];
          }
          $valueDisplay.css('background-color', '#' + value);
        });

        $item.find('.color-box.selectable').on('click', function(ev) {
          ev.preventDefault();

          var value = $(this).data('value').toLowerCase();
          if(options.sunny) {
            $color.val('0x' + mappingNormal[value.replace(/^0x/, '')]).trigger('change');
          } else {
            $color.val(value).trigger('change');
          }
          $valueDisplay.css('background-color', value.replace(/^0x/, '#'));
          $item.find('.color-box-wrap').removeClass('show');
        })

      });
    },

    tab: function() {
      this.each(function() {
        var $tab = $(this);

        $tab.click(function() {
          var $current = $(this);
          var name = $current.attr('name');

          $('a[name=' + name + ']').each(function(){
            $(this).removeClass('active');
          });

          $current.addClass('active');
        });
      });
    },

    itemSlider: function() {
      this.each(function() {
        var $slider = $(this);
        var name = $slider.attr('name');
        var $input = $('input[name=' + name + '][class=item-input]');

        $slider.on('input', function() {
          var $current = $(this);
          $input.val($current.val());
        });

        $input.change(function() {
          var $current = $(this);
          $slider.val($current.val());
        });
      });
    },

    itemDraggableList: function() {
      this.each(function() {
        var $handlebar = '<div class="item-draggable-handle">'
                        + '<div class="item-draggable-handle-bar"></div>'
                        + '<div class="item-draggable-handle-bar"></div>'
                        + '<div class="item-draggable-handle-bar"></div>'
                      + '</div>';

        $(this).children('label').append($handlebar);

        Sortable.create(this, {
          handle: '.item-draggable-handle'
        });
      });
    },

    itemDynamicList: function() {
      this.each(function() {
        var $list = $(this);

        $list.children('label').each(function() {
          var $deleteButton = $('<div class="delete-item"></div>');

          $deleteButton.click(function() {
            $(this).parent().remove();
          });

          $(this).append($deleteButton);
        });

        var $addButton = $('<div class="item add-item">Add one more...</div>');

        $list.append($addButton);

        $addButton.click(function() {
          var $inbox = $('<div class="item">'
                        + '<div class="item-input-wrapper">'
                          + '<input class="item-input" type="text" name="focus-box">'
                        + '</div>'
                      + '</div>');

          $inbox.insertBefore($list.children().last());

          var $input = $inbox.find('input');
          $input.focus();

          $input.keypress(function(e) {
            var key = e.which;
            if (key === 13) {
              stopEditing($input, $inbox);
            }
          });

          $input.focusout(function() {
            stopEditing($input, $inbox);
          });

          function stopEditing(input, inbox) {
            var text = input.val();
            inbox.html(text);

            var deletebutton = $('<div class="delete-item"></div>');

            deletebutton.click(function(){
              $(this).parent().remove();
            });

            inbox.append(deletebutton);
          }
        });
      });
    }
  });

  $(function() {
    $('.item-toggle').itemToggle();
    $('.item-checkbox').itemCheckbox();
    $('.item-select').itemSelect();
    $('.item-date').itemDate();
    $('.item-time').itemTime();
    $('.item-radio').itemRadio();
    $('.item-color-normal').itemColor({sunny: false});
    $('.item-color-sunny').itemColor({sunny: true});
    $('.tab-button').tab();
    $('.item-slider').itemSlider();
    $('.item-draggable-list').itemDraggableList();
    $('.item-dynamic-list').itemDynamicList();
  });
}(Zepto, Sortable));
