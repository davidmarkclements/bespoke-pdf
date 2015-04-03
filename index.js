var toPdf = require('bespoke-to-pdf');
var path = require('path');
var source = require('vinyl-source-stream');


module.exports = function (name, url, opts) {
  url = url || 'http://localhost:8080';

  opts = opts || {};
  opts.app = opts.app || 
    path.join(__dirname, '/node_modules/bespoke-pdf-nw-app');

  return toPdf(url, Infinity, opts).pipe(source(name));
}