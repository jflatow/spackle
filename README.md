# Spackle
## A tiny command-line utility to pack JS bundles for the web

Basically just a wrapper around [browserify](http://browserify.org/) and [minifyify](https://github.com/ben-ng/minifyify).
It takes a bunch of input JS and spits out a browserified version.
The source map is inline by default.
If you give it the name of a source map file, it will create that instead, and minify the source.

First pick your favorite way to install, e.g.:

    git clone https://github.com/jflatow/spackle.git
    cd spackle
    npm link

Then spackle it up:

    spackle all.js my.js files.js > bundle.js
    spackle site.js -s bundle.map.js > bundle.js

Requirements get pulled in automatically thanks to browserify.
Dead code is removed thanks to minifyify.
