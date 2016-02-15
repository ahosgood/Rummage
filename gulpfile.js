var gulp = require( 'gulp' ),
		jshint = require( 'gulp-jshint' ),
		uglify = require( 'gulp-uglify' ),
		rename = require( 'gulp-rename' );

gulp.task( 'build',
	function() {
		return gulp.src( 'src/rummage.js' )
				.pipe( jshint() )
				.pipe( jshint.reporter( 'default' ) )
				.pipe( rename( 'rummage.min.js' ) )
				.pipe( uglify() )
				.pipe( gulp.dest( 'dist' ) );
	}
);

gulp.task( 'dev',
	function() {
		return gulp.src( 'src/rummage.js' )
				.pipe( jshint() )
				.pipe( jshint.reporter( 'default' ) )
				.pipe( gulp.dest( 'dist' ) );
	}
);

gulp.task( 'default', ['build', 'dev'] );