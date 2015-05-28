#!/usr/bin/env node

function usage(unknown) {
  return 'USAGE: spackle [--help] [--sourcemapfile FILE] FILES ...\n'
}

function main(argv) {
  var browserify = require('browserify')
  var bundler = new browserify({debug: true})
  var bundled = argv._.map(bundler.add.bind(bundler))
  if (argv.sourcemapfile) {
    var fs = require('fs')
    var minifyify = require('minifyify')
    return bundler.plugin(minifyify).bundle(function (err, src, map) {
      fs.writeFile(argv.sourcemapfile, map)
    })
  }
  return bundler.bundle()
}

if (require.main === module) {
  var unknown;
  var spec = {
    alias: {
      'h': 'help',
      's': 'sourcemapfile',
    },
    boolean: ['help', 'minify'],
    unknown: function (opt) {
      if (opt[0] == '-') {
        unknown = opt
      } else {
        return true
      }
    }
  }

  var argv = require('minimist')(process.argv.slice(2), spec)
  if (unknown || argv.help) {
    process.stdout.write(usage(unknown))
  } else {
    main(argv).pipe(process.stdout)
  }
}
