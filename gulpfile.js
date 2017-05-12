var gulp = require('gulp');
var fs = require('fs');
var $ = require('gulp-load-plugins')();
var path = require('path');
var spawn = require('child_process').spawn;
var node;

var PORT = process.env.PORT || 3000;
/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */

function server() {
    if (node) node.kill();
    node = spawn('node', ['app.js', PORT], {stdio: 'inherit'});
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    }); 
}

gulp.task('server', server);

/**
 * $ gulp
 * description: start the development environment
 */
gulp.task('default', function() {
    gulp.watch('server');

    gulp.watch(['*.js', 'custom_modules/*.*', 'custom_modules/**/*.*', '!node_modules/**/*.*'], function() {
    	server();
    });

    server();
});

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) gulp.run('default');
});


/*----------------------------------------------------------------------
	HELPERS
*/

function handleErrors() {
	var args = Array.prototype.slice.call(arguments);
	// Send error to notification center with gulp-notify
	$.notify.onError({
		title: 'Build error',
		message: '<%= error%>',
		showStack: true
	}).apply(this, args);

	// Keep gulp from hanging on this task
	this.emit('end');
}
