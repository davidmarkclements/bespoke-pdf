'use strict';
/* globals nwrequire */
var co = require('co');
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
  : 'buffer';

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
  return new Promise(function (resolve) {
    setTimeout(function(){
      win.capturePage(function(buffer) {
        if (compare(buffer.slice(0, 10), prefix) === 0) {
          process.stdout.write(buffer);
          process.stdout.write(newline);
          resolve();
        }
       }, {format : options.format, datatype : dataType});
    }, options.evalDelay);
  });
}

function close() {
  win.close(true);
  gui.Window.get().close(true);
}

function moddom() {
  win.window.document.documentElement.classList.add('pdf');

  var s = win.window.document.createElement('style');
    s.innerHTML = '.pdf * { -webkit-transition:none!important } ';
    win.window.document.body.appendChild(s);
}

win.once('document-end', function init() {
  var BESPOKE_PDF = win.window.BESPOKE_PDF;

  extend(options, BESPOKE_PDF.options);

  setTimeout(function(){
    //override transitions:
    moddom()
    

    var take = co.wrap(function*() {
      var e = yield BESPOKE_PDF.when('activate');
      if (e.index === BESPOKE_PDF.slides.length - 1) {
        return yield brute(); 
      }

      //1 when the slide shows (activates) move to the 
      //  next slide directly (using .slide(n))
      e = yield [
        BESPOKE_PDF.when('activate'),
        BESPOKE_PDF.slide(e.index + 1)
      ][0];

      //2 then move back to the former slide
      e = yield [
        BESPOKE_PDF.when('activate'),
        BESPOKE_PDF.prev()
      ][0];

      //3 take a picture
      yield capture();

      //4 if not last slide goto 1 else brute
      take();
      BESPOKE_PDF.slide(e.index + 1); 
    });   

    take();
    BESPOKE_PDF.slide(0);
    
    //used on the final slide, since we can't to the 
    //forward backward dance, essentially call next an
    //unrealistic amount of times to brute force the 
    //final state
    function brute(force) {
      force = force || 40; //will there be more than 40 bullets?
      while (force--) BESPOKE_PDF.next();
      return capture().then(close)
    }

  }, options.delay);


});
