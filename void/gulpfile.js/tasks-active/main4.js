// ==== MAIN ==== //

var gulp = require('gulp');

// Default task chain: build -> (livereload or browsersync) -> watch
gulp.task('default', watch );

// Build a working copy of the theme
gulp.task('build', gulp.parallel('images', 'scripts', 'styles', 'theme'));

// Dist task chain: wipe -> build -> clean -> copy -> images/styles
// NOTE: this is a resource-intensive task!
gulp.task('dist', gulp.parallel('images-dist', 'styles-dist'];
