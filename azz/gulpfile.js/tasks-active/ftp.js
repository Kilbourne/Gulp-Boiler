var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );

gulp.task( 'deploy', function() {

    var conn = ftp.create( {
        host:     'ftp.menthalia.com',
        user:     '797252@aruba.it ',
        password: 'mthmenthalia9',
        parallel: 10,
        log: gutil.log
    } );

    var globs = [
        'build/**'
    ];

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src( globs, { base: '', buffer: false } )
        .pipe( conn.newer( '/www.menthalia.com/azzurronapolibasket/wp-content/themes/azzurroluca' ) ) // only upload newer files
        .pipe( conn.dest( '/www.menthalia.com/azzurronapolibasket/wp-content/themes/azzurroluca' ) );

} );