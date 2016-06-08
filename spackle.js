#!/usr/bin/env node

function usage(unknown) {
  return 'USAGE: spackle [--help] [--sourcemapfile FILE] [--sourcemapurl URL] FILES ...'
}

function exit(reason, code) {
  process.stdout.write(reason + '\n')
  process.exit(code)
}

function pack_js(argv) {
  var browserify = require('browserify')
  var bundler = new browserify({debug: true})
  var bundled = argv._.map(bundler.add.bind(bundler))
  if (argv.sourcemapfile) {
    var fs = require('fs')
    var minifyify = require('minifyify')
    return bundler.plugin(minifyify, {
      map: argv.sourcemapurl || argv.sourcemapfile
    }).bundle(function (err, src, map) {
      fs.writeFile(argv.sourcemapfile, map)
    })
  }
  return bundler.bundle()
}

function inline_css(argv) {
  var inlinecss = require('inline-css')
  var fs = require('fs')
  return new Promise(function (ok, fail) {
    fs.readFile(argv._[0], function (err, data) {
      if (err)
        return fail(err)
      return ok(data)
    })
  }).then(function (html) {
    return inlinecss(html, {url: argv.inlinecssurl || 'file:///'})
  })
}

if (require.main === module) {
  var unknown;
  var spec = {
    alias: {
      'h': 'help',
      'i': 'inlinecss',
      'I': 'inlinecssurl',
      's': 'sourcemapfile',
      'S': 'sourcemapurl'
    },
    boolean: ['help', 'inlinecss', 'minify'],
    unknown: function (opt) {
      if (opt[0] == '-') {
        unknown = opt
      } else {
        return true
      }
    }
  }

  var path = require('path')
  var argv = require('minimist')(process.argv.slice(2), spec)
  if (argv.help) {
    exit(usage(unknown))
  } else if (unknown) {
    exit(usage(unknown), 1)
  } else if (argv._.length < 1) {
    exit('Not enough arguments', 1)
  } else if (argv.inlinecss) {
    inline_css(argv).then(function (html) {
      process.stdout.write(html)
    }, function (err) {
      exit('Failed to inline CSS: ' + err, 1)
    })
  } else {
    var ext = path.extname(argv._[0])
    switch (ext) {
    case '.js':
      pack_js(argv).pipe(process.stdout)
      break
    default:
      exit('Unrecognized file type: ' + argv._[0], 1)
    }
  }
}
