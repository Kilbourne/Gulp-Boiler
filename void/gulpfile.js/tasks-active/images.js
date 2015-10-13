// ==== IMAGES ==== //

var gulp        = require('gulp')
  , plugins     = require('gulp-load-plugins')({ camelize: true })
  , config      = require('../../gulpconfig').images
  , onError     = require('../../gulpconfig').error
  ,plumber=     require('plumber')
;

// Copy changed images from the source folder to `build` (fast)
gulp.task('images', function() {
  return gulp.src(config.build.src)
  .pipe(plugins.changed(config.build.dest))
  .pipe(gulp.dest(config.build.dest))
  .pipe(plugin.size({showFiles: true}));
});

// Optimize images in the `dist` folder (slow)
gulp.task('images-dist', ['utils-dist'], function() {
  return gulp.src(config.dist.src)
  .pipe(plumber({errorHandler: onError}))
  .pipe(plugins.imagemin(config.imagemin))
  .pipe(gulp.dest(config.dist.dest))
  .pipe(plugin.size({showFiles: true}));
});
