var gulp = require('gulp')
, $ = require('gulp-load-plugins')({ camelize: true })
, config = require('../../gulpconfig').scripts
, caniuse = require('node-caniuse')
, fs = require('fs');
;
function scriptLint(src){
		return 	gulp.src(src)
				.pipe($.plumber({errorHandler: onError}))
  				.pipe($.jshint('.jshintrc'))
  				.pipe($.jshint.reporter('jshint-stylish'));
}
function scriptBundle(){
  var bundles = [];

  // Iterate through all bundles defined in the configuration
  for (var bundle in config.bundles) {
    if (config.bundles.hasOwnProperty(bundle)) {
      var chunks = [];

      // Iterate through each bundle and mash the chunks together
      config.bundles[bundle].forEach(function(chunk){
        chunks = chunks.concat(config.chunks[chunk]);
      });

      // Push the results to the bundles array
      bundles.push([bundle, chunks]);
    }
  }

  // Iterate through each bundle in the bundles array
  var tasks = bundles.map(function(bundle) {
    return gulp.src(bundle[1]) // bundle[1]: the list of source files
    .pipe(plumber({errorHandler: onError})
    .pipe(plugins.concat(config.namespace + bundle[0].replace(/_/g, '-') + '.js')) // bundle[0]: the nice name of the script; underscores are replaced with hyphens
    .pipe(gulp.dest(config.dest))
    .pipe(plugin.size({showFiles: true}));
  });

  // Cross the streams ;)
  return merge(tasks);

}
function scriptPolyfill(src){
	var conf=config.autopolyfiller;
    return gulp.src(src)
        .pipe($.autopolyfiller(conf.file))
        .pipe(gulp.dest(dest));
}
function scriptCaniuse(src){
	caniuse({
	  files: src,
	  browsers: config.caniuse.browser,
	  reporter: function (data) {
					stream = fs.createWriteStream("my_file.txt");
					stream.once('open', function(fd) {
						stream.write(DATA);					
						stream.end();
					});
	 			}
	});
}
function scriptMinify(){
  return gulp.src(config.minify.src)  
	.pipe(plumber({errorHandler: onError}))
	.pipe(plugins.rename(config.minify.rename))
	.pipe(plugins.uglify(config.minify.uglify))
	.pipe(gulp.dest(config.minify.dest))
	.pipe(plugin.size({showFiles: true}));
}