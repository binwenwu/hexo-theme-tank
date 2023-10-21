/*!
 * code-points | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/code-points.js
*/
function codePoints(str, option) {
  'use strict';

  option = option || {unique: false};

  if (typeof str !== 'string') {
    throw new TypeError(
      str +
      ' is not a string. First argument to code-points must be a string.'
    );
  }

  var result = [];

  var index = 0;
  while (index < str.length) {
    var point = codePoint(str.charAt(index) + str.charAt(index + 1));

    if (point > 0xffff) {
      index += 2;
    } else {
      index += 1;
    }

    if (option.unique && result.indexOf(point) !== -1) {
      continue;
    }

    result.push(point);
  }

  return result;
}

var codePoint = require('code-point');
module.exports = codePoints;
