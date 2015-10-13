var ngrok = require('ngrok');

gulp.task('ngrok', ['browsersync'],function () {
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
