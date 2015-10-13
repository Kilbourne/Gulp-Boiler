// ==== STYLES ==== //

var gulp          = require('gulp')
  , gutil         = require('gulp-util')
  , plugins       = require('gulp-load-plugins')({ camelize: true })
  , config        = require('../../gulpconfig').styles
  , autoprefixer  = require('autoprefixer')
  , onError     = require('../../gulpconfig').error
  ,plumber=     require('plumber')
;

// Build stylesheets from source Sass files, autoprefix, and write source maps (for debugging) with libsass
gulp.task('styles-libsass', function() {
  return gulp.src(config.build.src)
.pipe(plumber({errorHandler: onError}))
  .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass(config.libsass))
    .pipe(plugins.postcss([autoprefixer(config.autoprefixer)]))
  .pipe(plugins.sourcemaps.write())
  .pipe(gulp.dest(config.build.dest))
  .pipe(plumber({errorHandler: onError}); // Drops the unminified CSS file into the `build` folder
});

// Copy stylesheets from the `build` folder to `dist` and minify them along the way
gulp.task('styles-dist', ['utils-dist'], function() {
  return gulp.src(config.dist.src)
.pipe(plumber({errorHandler: onError}))
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.minifyCss(config.minify))
  .pipe(plugins.sourcemaps.write('./')) // Writes an external sourcemap
  .pipe(gulp.dest(config.dist.dest))
  .pipe(plumber({errorHandler: onError});
});

// Easily configure the Sass compiler from `/gulpconfig.js`
gulp.task('styles', ['styles-'+config.compiler]);
