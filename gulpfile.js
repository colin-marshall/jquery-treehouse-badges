'use strict';

var   gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
	  sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	  maps = require('gulp-sourcemaps'),
	minify = require('gulp-minify-css'),
	   del = require('del'),
	prefix = require('gulp-autoprefixer'); 

gulp.task("concatScripts", function() {	
	return gulp.src([
		'src/js/jquery.treehouse-badges.js'
		])
		.pipe(maps.init())
		.pipe(concat('jquery.treehouse-badges.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task("minifyScripts", ["concatScripts"], function() {
	return gulp.src('src/js/jquery.treehouse-badges.js')
		.pipe(uglify())
        .pipe(rename({
 			extname: '.min.js'
			}))
        .pipe(gulp.dest('dist/js'));
});

gulp.task("compileSass", function() {
	return gulp.src('src/scss/treehouse-badges-styles.scss')
		.pipe(maps.init())
		.pipe(sass())
		.pipe(prefix())
		.pipe(maps.write('./'))
		.pipe(gulp.dest('dist/css'));
});

gulp.task("minifyCSS", ["compileSass"], function() {
	return gulp.src('dist/css/treehouse-badges-styles.css')
		.pipe(minify())
		.pipe(rename({
 			extname: '.min.css'
			}))
		.pipe(gulp.dest('dist/css'));
});

gulp.task("watch", function() {
	gulp.watch('src/scss/**/*.scss', ['minifyCSS']);
	gulp.watch('src/js/**/*.js', ['minifyScripts']);
});

gulp.task("clean", function() {
	return del(['dist']);
});

gulp.task("build", ['minifyScripts', 'minifyCSS']);

gulp.task("default", ['clean'], function() {
	return gulp.start('build');
});