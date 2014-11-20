'use strict'

var gulp = require('gulp')
var $ = require('gulp-load-plugins')()

gulp.task('default', function() {
  gulp.src('./src/**/*.js')
    .pipe($.wrap('!function(a,b){"function"==typeof define&&define.amd?define(b):"object"==typeof exports?module.exports=b(require,exports,module):a.audioWave=b()}(this,function(){<%= contents %>});'))
    .pipe($.jsbeautifier({
      config: '.jsbeautifyrc'
    }))
    .pipe(gulp.dest('./dist'))
    .pipe($.uglify({
      "mangle": true
    }))
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./demo/js'))
})

gulp.task('demo', $.serve('demo'))
