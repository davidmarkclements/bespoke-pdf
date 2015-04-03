/*!
 * bespoke-pdf v1.0.4
 *
 * Copyright 2015, 
 * This content is released under the MIT license
 * http://opensource.org/licenses/MIT
 */

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self);var n=f;n=n.bespoke||(n.bespoke={}),n=n.plugins||(n.plugins={}),n.pdf=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/* global BESPOKE_PDF */
module.exports = function(options) {
  return function(deck) {

    if (!(window.__nwWindowId && window.nwDispatcher)) {
      return;
    }

    window.BESPOKE_PDF = Object.create(deck);

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
        slide.element.dataset.pdfId = slide
          .headline
          .innerText
          .trim()
          .toLowerCase()
          .split(' ')
          .join('-');

        return slide.element;
      })
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

    options = options || {};
    BESPOKE_PDF.options = options;
    options.delay = options.delay || 250;
    options.evalDelay  = options.evalDelay || 100;
  };
};

},{}]},{},[1])
(1)
});