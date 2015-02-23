var toPdf = require('bespoke-to-pdf');
var path = require('path');
var source = require('vinyl-source-stream');
var exit = require('gulp-exit');

module.exports = function (name, url, opts) {
  url = url || 'http://localhost:8080';

  opts = opts || {};
  opts.app = opts.app || path.join(__dirname, '/nw-app');

  return source(name)
    .pipe(toPdf(url, Infinity, opts))
    .pipe(exit());
}