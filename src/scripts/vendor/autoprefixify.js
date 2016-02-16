var path = require('path');
var through = require('through');
var postcss = require('postcss');
var autoprefixer = require('autoprefixer');
var requireFromString = require('require-from-string');

/**
 * Stringifies the content
 * @param   {string}    content
 * @returns {string}
 */
function stringify (content) {
  return 'module.exports = ' + JSON.stringify(content) + ';\n';
}

module.exports = function (file, options) {

  /**
   * The function Browserify will use to transform the input.
   * @param   {string} file
   * @returns {stream}
   */
  function browserifyTransform (file) {
    var extensions = ['.css', '.sass', '.scss', '.less'];
    var chunks = [];

    if (extensions.indexOf(path.extname(file)) === -1) {
      return through();
    }

    var write = function (buffer) {
      chunks.push(buffer);
    };

    var end = function () {
      var contents = requireFromString(Buffer.concat(chunks).toString('utf8'));
      contents = postcss([autoprefixer(options)]).process(contents).css;
      this.queue(stringify(contents));
      this.queue(null);
    };

    return through(write, end);
  }

  if (typeof file !== 'string') {
    options = file;
    return browserifyTransform;
  } else {
    return browserifyTransform(file);
  }
};
