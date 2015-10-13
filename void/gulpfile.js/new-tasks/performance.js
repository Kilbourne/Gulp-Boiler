gulp.task('pagespeed', ['ngrok'], function () {
	return psi({
	    nokey: 'true', // or use key: ‘YOUR_API_KEY’
	    url: url,
	    strategy: 'mobile'
	});
});
