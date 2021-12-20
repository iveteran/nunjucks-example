const fs = require('fs');
const gulp = require('gulp');
const njkRender = require('gulp-nunjucks-render');
const sassRender = require('gulp-sass');
const minify = require('gulp-minify');
const config = require('./config/config');
const browserSync = require('browser-sync').create();

gulp.task('dir', async function() {
  if (!fs.existsSync(config.paths.public_dir)) {
    fs.mkdirSync(config.paths.public_dir);
    if (!fs.existsSync(config.paths.public_dir + '/css')) {
      fs.mkdirSync(config.paths.public_dir + '/css');
    }
    if (!fs.existsSync(config.paths.public_dir + '/js')) {
      fs.mkdirSync(config.paths.public_dir + '/js');
    }
  }
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: config.paths.public_dir,
    },
  });
});

gulp.task('watch', function() {
  gulp.series('compileAll');
  gulp.watch(
    [config.paths.resources_dir + '/**/*.+(html|js|css|scss|njk)'],
    ['compileAll']
  );

  gulp
    .watch(config.paths.public_dir + '/**/*')
    .on('change', browserSync.reload);
});

gulp.task('njk', function() {
  return gulp
    .src(config.paths.views_dir + '/*.@(html|njk)')
    .pipe(
      njkRender({
        path: [config.paths.views_dir],
        data: config.njk.templateVars,
      })
    )
    .pipe(gulp.dest(config.paths.public_dir));
});

gulp.task('sass', function() {
  return gulp
    .src(config.paths.assets_dir + '/scss/**/*.scss')
    .pipe(
      sassRender({
        outputStyle: config.sass.outputStyle,
      })
    )
    .pipe(gulp.dest(config.paths.public_dir + '/css'));
});

gulp.task('jsMinify', function() {
  return gulp
    .src(config.paths.assets_dir + '/js/**/*.js')
    .pipe(
      minify({
        ext: {
          src: '.js',
          min: '.min.js',
        },
        noSource: config.js.doKeepSource,
        exclude: [config.paths.vendor_dir],
        ignoreFiles: ['.min.js'],
      })
    )
    .pipe(gulp.dest(config.paths.public_dir + '/js'));
});

gulp.task('js', function() {
  return gulp
    .src(config.paths.assets_dir + '/js/**/*.js')
    .pipe(gulp.dest(config.paths.public_dir + '/js'));
});

gulp.task('vendorJS', function() {
  return gulp
    .src(config.paths.vendor_dir + '/js/**/*.js')
    .pipe(gulp.dest(config.paths.public_dir + '/js'));
});

gulp.task('vendorCSS', function() {
  return gulp
    .src(config.paths.vendor_dir + '/css/**/*.css')
    .pipe(gulp.dest(config.paths.public_dir + '/css'));
});

gulp.task('compileAll', function() {
  gulp.series('dir');
  gulp.series('njk');
  gulp.series('sass');
  config.js.doCompress ? gulp.series('jsMinify') : gulp.series('js');
  gulp.series('vendorJS');
  gulp.series('vendorCSS');
});

//gulp.task('default', gulp.parallel(['compileAll']));
gulp.task('default', gulp.parallel(['dir', 'njk', 'sass', (config.js.doCompress ? 'jsMinify': 'js'), 'vendorJS', 'vendorCSS']));

gulp.task('auto', gulp.parallel(['browserSync', 'watch']));

module.exports = gulp;
