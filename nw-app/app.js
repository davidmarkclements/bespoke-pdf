'use strict';
/* globals nwrequire */
var compare = require('buffer-compare');
var extend = require('extend');
var gui = nwrequire('nw.gui');
var options = JSON.parse(gui.App.argv.toString());
// Needed if the procces is running in a framebuffer (like on travis)
var show = !!process.env.BESPOKE_PDF_DEBUG;
if (show) { gui.Window.get().show(); }

var dataType = (options.encoding === 'base64')
  ? 'raw'
  : (options.encoding === 'binary')
  ? 'buffer'
  : 'buffer'
show=true
if (process.platform === 'linux') { options.height += 38;}

global.win = gui.Window.open(options.url, {
  width: options.width,
  height: options.height,
  show: show,
  frame: show
});

var prefix = Buffer('data:image');
var newline = Buffer('\n');

function capture(cb) {
  setTimeout(function(){
    win.capturePage(function(buffer) {
      if (compare(buffer.slice(0, 10), prefix) === 0) {
        process.stdout.write(buffer);
        process.stdout.write(newline);
        cb();        
      }
     }, {format : options.format, datatype : dataType});
  }, options.evalDelay);
}

function close() {
  win.close(true);
  gui.Window.get().close(true);
}

win.once('document-end', function init() {
  var BESPOKE_PDF = win.window.BESPOKE_PDF;

  extend(options, BESPOKE_PDF.options);

  setTimeout(function(){
    //override transitions:
    var s = win.window.document.createElement('style');
    s.innerHTML = ' * { -webkit-transition:none!important } ';
    win.window.document.body.appendChild(s);
    BESPOKE_PDF.on('activate', function () {
      capture(function () {
        if (BESPOKE_PDF.slide() >= BESPOKE_PDF.slides.length-1) { 
          return close(); 
        }
        BESPOKE_PDF.next();

      });
    });

    BESPOKE_PDF.slide(0);

  }, options.delay);


});
