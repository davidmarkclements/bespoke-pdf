module.exports = function(options) {
  return function(deck) {

    if (!(window.__nwWindowId && window.nwDispatcher)) {
      return;
    }

    window.BESPOKE_PDF = Object.create(deck);

    options = options || {};
    BESPOKE_PDF.options = options;
    options.delay = options.delay || 250;
    options.evalDelay  = options.evalDelay || 100;
  };
};
