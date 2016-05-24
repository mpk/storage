/**
 *	Test runner options
 */
module.exports = function( options ) {
	options.set({
		files: ['../*-spec.js'],
		frameworks: ['browserify', 'jasmine'],
		plugins: ['karma-browserify', 'karma-jasmine'],
		preprocessors: { '../*-spec.js': ['browserify'] }
	});
};