# bespoke-pdf

PDF generator for [Bespoke.js](https://github.com/markdalgleish/bespoke.js)

## Bespoke Plugin

### Download

Download the [production version][min] or the [development version][max], or use a [package manager](#package-managers).

[min]: https://raw.github.com/davidmarkclements/bespoke-pdf/master/dist/bespoke-pdf.min.js
[max]: https://raw.github.com/davidmarkclements/bespoke-pdf/master/dist/bespoke-pdf.js

### Usage
`bespoke-pdf` is simultaneously a bespoke plugin, 
and a gulp task - the bespoke plugin provides hooks for
the gulp task. Both pieces are necessary.

This bespoke plugin is shipped in a [UMD format](https://github.com/umdjs/umd), meaning that it is available as a CommonJS/AMD module or browser global.

For example, when using CommonJS modules:

```js
var bespoke = require('bespoke'),
  pdf = require('bespoke-pdf');

bespoke.from('article', [
  pdf()
]);
```

#### Options

##### setup [Function]

```
bespoke.from('article', [
  pdf({
    setup: function () {  
      //prime slide environment for pdf output
      //for instance, disable the "camera" slide or whatever
    }
  })
]);
```

##### delay [Number]
Delay before slide taking begins

##### evalDelay [Number]
Delay between each shot


When using browser globals:

```js
bespoke.from('article', [
  bespoke.plugins.pdf()
]);
```

### Package managers

#### npm

```bash
$ npm install bespoke-pdf
```

#### Bower

```bash
$ bower install bespoke-pdf
```

## Gulp Task

Once the bespoke-pdf has been included in a 
presentation, it can be integrated into a gulpfile.

For this part, bespoke-pdf *must* be installed via
npm.

```js
var pkg = require('./package.json'),
  pdf = require('bespoke-pdf'),
  rimraf = require('gulp-rimraf');

gulp.task('pdf', ['connect'], function () { 
  return pdf(pkg.name + '.pdf')
    .pipe(gulp.dest('dist'));
});

gulp.task('clean:pdf', function() {
  return gulp.src('dist/' + pkg.name + '.pdf')
    .pipe(rimraf());
});
```

### PDF Output Customizations

In some cases, we don't want certain presentation visuals
landing in generated PDF's. During PDF generation, `bespoke-pdf`
adds a `pdf` class to the root `<html>` element. 
We can use this class to style any part of the page, 
e.g. in Stylus:

```styl
  .pdf
    #my-fancy-overlay
      display none
```

Likewise there may be particular slides. Any hidden `section`
element will be removed from the deck prior to PDF generation.

For instance, say we're using `bespoke-hash` and we have a
slide called `named-route`, we could do

```styl
  .pdf
    [data-bespoke-hash="named-route"]
      display none
```

`bespoke-pdf` will detect this and remove the slide.

To enable the use markdown without littering it with
structural HTML tags, `bespoke-pdf` also provides another
way to style and hide slides by adding a `data-pdf-id`
attribute based on the slides headline, which is determined
by the first `h1`, `h2`, `h3`, `h4`, `h5`, `li`, `p` or `span` element in that order.

For instance, say there's a slide with an `h2` element 
named "Emphatic Slide!". `bespoke-pdf` automatically creates
a `data-pdf-id` attribute with the value of `emphatic-slide!`
(we lowercase and replace spaces with dashes).

This allows us to remove it like so:

```styl
[data-pdf-id="emphatic-slide!"]
  display none
```

See the `example/src/styles/main.styl` file for an
example of this - and notice that `example/dist/presentation-hello-world.pdf` lacks the "Emphatic Slide!" slide.


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

## Sponsorship

Sponsored by [nearForm](http://nearform.com)


