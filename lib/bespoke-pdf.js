/* global BESPOKE_PDF */
module.exports = function(options) {
  options = options || {};
  options.delay = options.delay || 250;
  options.evalDelay  = options.evalDelay || 100;
  
  return function(deck) {

    if (!(window.__nwWindowId && window.nwDispatcher)) {
      return;
    }
    
    window.BESPOKE_PDF = Object.create(deck);

    if (options.setup instanceof Function) { options.setup(BESPOKE_PDF); }

    document.documentElement.classList.add('pdf');

    BESPOKE_PDF.once = function (evt, cb) {
      var off = BESPOKE_PDF.on(evt, function (e) {
        off();
        cb(e);
      });
    };

    BESPOKE_PDF.when = function (evt) {
      //NOTE: we're in the NW.js environment - it's chrome, 
      //chrome has es6 Promise
      return new Promise(function (resolve) {
        BESPOKE_PDF.once(evt, function (e) {
          resolve(e);
        });
      });
    };

    BESPOKE_PDF.slides
      .map(function (el) { 
        return {
          element: el, 
          headline: el.querySelector('h1') || 
            el.querySelector('h2') || 
            el.querySelector('h3') || 
            el.querySelector('h4') || 
            el.querySelector('h5') ||
            el.querySelector('li') ||
            el.querySelector('p') ||
            el.querySelector('span') 
        };
      })
      .map(function (slide) {

        if (!slide.headline) { return; }

        slide.element.dataset.pdfId = slide
          .headline
          .innerText
          .trim()
          .toLowerCase()
          .split(' ')
          .join('-');

        return slide.element;
      })
      .filter(Boolean)
      .map(getComputedStyle)
      .map(function (style, i) {
        return style.display === 'none' && i;
      })
      .filter(function (n) {
        return typeof n === 'number';
      })
      .forEach(function(index) {
         BESPOKE_PDF.slides.splice(index, 1);
       });

    BESPOKE_PDF.options = options;

  };
};
