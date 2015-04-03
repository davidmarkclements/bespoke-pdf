/* global suite, test */
require('buffer-equals-polyfill');
var exec = require('child_process').exec;
var assert = require('assert');
var fs = require('fs');
suite('bespoke-pdf');
process.stdout.write('\n  Note: Tests can take a while...');

test('generates PDF from bespoke slide deck', function (done) {
  this.timeout(1e7);
  exec('cd test/fixtures/normative/slides && npm i && gulp', function () {
    var fixture = fs.readFileSync('test/fixtures/normative/presentation-hello-world.pdf');
    var generated = fs.readFileSync('test/fixtures/normative/slides/dist/presentation-hello-world.pdf');

    //the first part of pdfs is never equal. 
    fixture = fixture.slice(0.4 * 1024 * 1024);
    generated = generated.slice(0.4 * 1024 * 1024);

    assert(generated.equals(fixture));
    done();
  });

});


test('allows hiding of slides with CSS rules', function (done) {
  this.timeout(1e7);
  exec('cd test/fixtures/hide-slide-via-css/slides && npm i && gulp', function () { 
    var fixture = fs.readFileSync('test/fixtures/hide-slide-via-css/presentation-hello-world.pdf');
    var generated = fs.readFileSync('test/fixtures/hide-slide-via-css/slides/dist/presentation-hello-world.pdf');

    //the first part of pdfs is never equal. 
    fixture = fixture.slice(0.4 * 1024 * 1024);
    generated = generated.slice(0.4 * 1024 * 1024);

    assert(generated.equals(fixture));

    done();
  });
  
});