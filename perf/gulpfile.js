'use strict';

var gulp 			= require('gulp'),
	plumber 		= require('gulp-plumber'),
	gutil			= require('gulp-util'),
	// beep			= require('beepbeep'),
	notify 			= require('gulp-notify'),
	size 			= require('gulp-size'),
	rename 			= require('gulp-rename'),
	// libSass
	// sass 			= require('gulp-sass'),
	sass 			= require('gulp-ruby-sass'),
	autoprefixer 	= require('gulp-autoprefixer'),
	cmq				= require('gulp-combine-media-queries'),
	minifyCSS 		= require('gulp-minify-css'),
	jshint 			= require('gulp-jshint'),
	concat 			= require('gulp-concat'),
	uglify 			= require('gulp-uglify'),
	psi 			= require('psi'),
	ngrok 			= require('ngrok'),
	cp 				= require('child_process'),
	browserSync 	= require('browser-sync'),
	// filter      	= require('gulp-filter'),
	imageMin 		= require('gulp-imagemin'),
	cwebp 			= require('gulp-cwebp'),
	imageResize 	= require('gulp-image-resize'),
	cache 			= require('gulp-cache'),
	cached 			= require('gulp-cached'),
	changed 		= require('gulp-changed'),
	newer 			= require('gulp-newer'),
	parallel 		= require('concurrent-transform'),
	os 				= require('os-utils'),
	minifyHTML 		= require('gulp-minify-html'),
	clean 			= require('gulp-clean'),
	// zopfli 			= require('gulp-zopfli'),
	// zip 			= require('gulp-zip'),
	url				= 'http://1ec934f4.ngrok.com/',
	reload 			= browserSync.reload;

var onError			= function(err) {
	gutil.beep();
	gutil.log(gutil.colors.green(err + '\n'));
};

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/*==========  Paths  ==========*/

var paths = {
 	styles: {
		src:   			'assets/sass/main.scss',
		dest:  			'build/css',
		destVen:     	'assets/sass/vendor',
		destVenSl:     	'assets/sass/vendor/SassyLists',
		destProd:  		'html/build/css',
		watch: 			'assets/sass/**/*.scss',
		style: 			'build/css/main.css',
		styleProd: 		'html/build/css/main.css',
		styleMin:		'build/css/main.min.css',
		styleMinProd:	'html/build/css/main.min.css'
  	},
  	scripts: {
		src:  			'assets/js/**/*.js',
		dest: 			'build/js',
		destProd: 		'html/build/js',
		destVen: 		'assets/js/vendor',
		script: 		'build/js/main.js',
		scriptProd: 	'html/build/js/main.js',
		scriptMin: 		'build/js/main.min.js',
		scriptMinProd: 	'html/build/js/main.min.js',
		bundleMain: 	'build/js/main.bundle.js',
		bundleMainMin:  'build/js/main.bundle.min.js',
		watch: 			['assets/js/**/*.js', '!/assets/js/vendor/**/*.js']
  	},
  	jshint: {
		src: [
				  		'assets/js/**/*.js',
				  		'!assets/js/vendor/**/*.js'
		]
	},
	bundles: {
		main: [
						'assets/js/main.js',
						'assets/js/vendor/**/*.js',
						'!assets/js/vendor/bootstrap-sprockets.js',
						'!assets/js/vendor/bootstrap.js',
		]
	},
  	images: {
		src:  			'assets/img/**/*.{jpg, png, svg, gif, webp}',
		dest: 			'build/img',
		destOpt: 		'build/img/opt',
		destProd: 		'html/build/img',
		watch:  		'assets/img/**/*.{jpg, png, svg, gif, webp}',
		watchOpt: 		'build/img/opt/*.{jpg, png, svg, gif, webp}',
		watchDest: 		'build/img/*.{jpg, png, svg, gif, webp}',
		watchProd: 		'html/build/img/**/*.{jpg, png, svg, gif, webp}'
  	},
  	html: {
  		dest: 			'html',
  		watch: 			['index.html', '_layouts/*.html', '_includes/**/*', '_posts/**/*'],
  		watchProd: 		'html/**/*.html'
  	},
	copy: {
		styles: 		'bower_components/SassyLists/**/*',
		scripts: 		'bower_components/bootstrap-sass-official/assets/javascripts/**/*.js'
	},
	clean: {
		img: 			'build/img',
		imgProd: 		'html/build/img',
		styles: 		'build/css',
		stylesProd: 	'html/build/css',
		scripts: 		'build/js',
		scriptsProd: 	'html/build/js',
		build: 			'build',
		buildProd: 		'html/build',
		prod: 			'html'
	}
};


/*==================================
=            Gulp Tasks            =
==================================*/



gulp.task('browser-sync', function() {
    browserSync({server: {baseDir: paths.html.dest}});
});

gulp.task('sass', function () {
	return gulp.src(paths.styles.watch)
		.pipe(plumber({errorHandler: onError}))
		.pipe(sass())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(gulp.dest(paths.styles.destProd))
		.pipe(size({showFiles: true}))
		.pipe(notify('sass is done.\n'));
});

gulp.task('sass-min', ['sass'], function () {
	return gulp.src(paths.styles.style)
		.pipe(plumber({errorHandler: onError}))
		// Doesn't work with debug-map mixin
		// uncomment for production
		// .pipe(cmq({log: true}))
		.pipe(minifyCSS())
		// .pipe(zopfli())
		// .pipe(zip('main.css.zip'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(gulp.dest(paths.styles.destProd))
		.pipe(size({showFiles: true}))
		.pipe(notify('Sass-min is done.\n'));
});

gulp.task('sass-reload', ['sass-min'], function () {
	return gulp.src(paths.styles.styleMin)
		.pipe(reload({stream: true}));
});

gulp.task('jshint-gulp', function () {
	return gulp.src('gulpfile.js')
	    .pipe(cache(jshint('.jshintrc')))
        .pipe(jshint.reporter('jshint-stylish'))
	    .pipe(notify('jshint-gulp is done.\n'));
});

gulp.task('jshint', ['jshint-gulp'], function () {
	return gulp.src(paths.scripts.script)
	    .pipe(cache(jshint('.jshintrc')))
        .pipe(jshint.reporter('jshint-stylish'))
	    .pipe(notify('jshint-gulp is done.\n'));
});

gulp.task('concat', ['jshint'], function () {
	return gulp.src(paths.bundles.main)
		.pipe(concat('main.bundle.js'))
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(gulp.dest(paths.scripts.destProd))
		.pipe(size({showFiles: true}));
});

gulp.task('js', ['concat'], function () {
	return gulp.src(paths.scripts.bundleMain)
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(gulp.dest(paths.scripts.destProd))
		.pipe(notify('js is done.\n'));
});

gulp.task('js-reload', ['js'], function () {
	return gulp.src(paths.scripts.bundleMainMin)
		.pipe(plumber({errorHandler: onError}))
		.pipe(reload({stream:true}));
});

gulp.task('image-min', function () {
	return gulp.src(paths.images.src)
		.pipe(plumber({errorHandler: onError}))
		.pipe(cached(imageMin({optimizationLevel: 3, progressive: true, interlaced: true})))
		.pipe(gulp.dest(paths.images.destOpt))
		.pipe(size({showFiles: true}))
		.pipe(notify('image-min is done.\n'));
});

gulp.task('image-resize-sm', ['image-min'], function () {
	return 	gulp.src(paths.images.watchOpt)
		.pipe(plumber({errorHandler: onError}))
		.pipe(changed(paths.images.dest))
		.pipe(parallel(imageResize({
			width 	: 400,
			height 	: 300,
			crop 	: true,
			upscale : false
		}), os.cpuUsage(function(v) { console.log( 'CPU Usage (%): ' + v ); })))
	    .pipe(rename({suffix: '-sm'}))
		.pipe(gulp.dest(paths.images.dest))
		.pipe(size({showFiles: true}))
		.pipe(gulp.dest(paths.images.destProd));
	});

gulp.task('image-resize-md', ['image-resize-sm'], function () {
	return	gulp.src(paths.images.watchOpt)
		.pipe(plumber({errorHandler: onError}))
		.pipe(changed(paths.images.dest))
		.pipe(parallel(imageResize({
			width : 800,
			height : 600,
			crop : true,
			upscale : false
		}), os.cpuUsage(function(v) { console.log( 'CPU Usage (%): ' + v ); })))
	    .pipe(rename({suffix: '-md'}))
	    .pipe(gulp.dest(paths.images.dest))
		.pipe(size({showFiles: true}))
		.pipe(gulp.dest(paths.images.destProd));
});

gulp.task('image-resize-lg', ['image-resize-md'], function () {
	return	gulp.src(paths.images.watchOpt)
		.pipe(plumber({errorHandler: onError}))
		.pipe(changed(paths.images.dest))
		.pipe(parallel(imageResize({
			width : 1200,
			height : 900,
			crop : true,
			upscale : false
		}), os.cpuUsage(function(v) { console.log( 'CPU Usage (%): ' + v ); })))
	    .pipe(rename({suffix: '-lg'}))
		.pipe(size({showFiles: true}))
	    .pipe(gulp.dest(paths.images.dest))
		.pipe(gulp.dest(paths.images.destProd));
});

gulp.task('cwebp', ['image-resize-lg'], function () {
	return gulp.src(paths.images.watchProd)
		.pipe(plumber({errorHandler: onError}))
		.pipe(changed(paths.images.watchDest))
	    .pipe(parallel(cwebp()), os.cpuUsage(function(v) { console.log( 'CPU Usage (%): ' + v ); }))
	    .pipe(gulp.dest(paths.images.dest))
	    .pipe(gulp.dest(paths.images.destProd))
	    .pipe(notify('cwebp is done.\n'));
});

gulp.task('img-reload', ['cwebp'], function () {
	return gulp.src(paths.images.destProd)
		.pipe(plumber({errorHandler: onError}))
		.pipe(reload({stream:true}))
	    .pipe(notify('img-reload is done.\n'));
});

gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll', ['jekyll-build'], function() {
  	return gulp.src(paths.html.watchProd)
	    .pipe(minifyHTML())
	    .pipe(gulp.dest(paths.html.dest));
});

gulp.task('jekyll-rebuild', ['jekyll'], function () {
    reload();
});

gulp.task('copy-styles', function() {
	return gulp.src(paths.copy.styles)
    	.pipe(gulp.dest(paths.styles.destVen + '/SassyLists'));
});

gulp.task('copy-scripts', function() {
	return gulp.src(paths.copy.scripts)
    	.pipe(gulp.dest(paths.scripts.destVen));
});

gulp.task('clear-cache', function(done) {
	return cache(cache.caches = {});
});

gulp.task('clean', ['clear-cache'], function() {
  return gulp.src(paths.html.dest, {read: false})
    .pipe(clean());
});

gulp.task('ngrok', function () {
	ngrok.connect({
	    authtoken: 'aGJcNEqh838HDfvyheIe', //2BUMGp1fJDzPal7FvxN2
	    //httpauth: 'login:password',
	    port: 3000
	  }, function(err, url) {
	    if (err !== null) {
	      console.log( err );
	    }
	});
});

gulp.task('pagespeed', ['ngrok'], function () {
	return psi({
	    nokey: 'true', // or use key: ‘YOUR_API_KEY’
	    url: url,
	    strategy: 'mobile'
	});
});

// gulp.task('perform', ['copy-css', 'copy-js', 'sass-min', 'js', 'cwebp', 'jekyll-rebuild'], function () {});

gulp.task('watch', ['sass-min', 'js', 'browser-sync'], function () {
	gulp.watch(paths.styles.watch, ['sass-reload']);
	gulp.watch(paths.scripts.watch, ['js-reload']);
	gulp.watch(paths.images.watch, ['img-reload']);
	gulp.watch(paths.html.watch, ['jekyll-rebuild']);
});
