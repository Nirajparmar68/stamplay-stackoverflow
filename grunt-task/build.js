module.exports = function (grunt) {
	/**
	 * Assets creation and minification
	 */

	//Builds all in one css app file 
	grunt.registerTask('buildCss', 'Minify All css', [
		'clean:cssmin',
		'concat:css',
		'cssmin:minify'
	]);

	//Builds external libraries minified js 
	grunt.registerTask('buildlib', 'Create lib.min.js asset', [
		'clean:lib',
		'concat:lib',
		'uglify:lib'
	]);

	//Builds complete app
	grunt.registerTask('buildapp', 'Create app.min.js asset', [
		'clean:app',
		// 'ngmin:app',
		'concat:app',
		'uglify:app'
	]);

	//Builds everything
	grunt.registerTask('build', 'Create Stamplay production ready project in /assets', function () {
		grunt.task.run(['buildCss', 'buildlib', 'buildapp']);
	});

}