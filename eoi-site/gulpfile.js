var gulp = require('gulp');
var less = require('gulp-less');
var sass = require('gulp-sass');
var data = require('gulp-data');
var nunjucksRender = require('gulp-nunjucks-render');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var fs = require('fs');
var markdown = require('nunjucks-markdown');
var marked = require('marked');
const csv = require('csvtojson');

var BUILD_DIR = "./build"

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pendantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

gulp.task('nunjucks', function () {
    return gulp.src('pages/**/*.+(html|nunjucks)')
        // Adding data to Nunjucks
        .pipe(data(function (srcFile, cb) {
            var mainData = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
            var pilotData = JSON.parse(fs.readFileSync('./data-pilot.json', 'utf8'));
            // var schoolData = JSON.parse(fs.readFileSync('./data-schools.csv', 'utf8'));
            var schoolData = [];
            csv().fromFile('./data-schools.csv')
                .on('json', (row) => {
                    schoolData.push(row);
                })
                .on('end', () => {
                    var result = Object.assign({}, mainData, pilotData, { schoolData });
                    cb(null, result);
                })
        }))
        .pipe(nunjucksRender({
            path: ['templates'],
            manageEnv: function (env) {
                markdown.register(env, marked);
            }
        }))
        .pipe(gulp.dest(BUILD_DIR))
});

// Compile LESS files from /less into /css
gulp.task('less', function () {
    return gulp.src(['less/agency.less', 'less/unomomento.less'])
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest(`${BUILD_DIR}/css`))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function () {
    return gulp.src([`${BUILD_DIR}/css/*.css`, `!${BUILD_DIR}/css/*.min.css`])
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(`${BUILD_DIR}/css`))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function () {
    return gulp.src('js/*.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(`${BUILD_DIR}/js/`))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('copy-js', function () {
    gulp.src(['js/*.js'])
        .pipe(gulp.dest(`${BUILD_DIR}/js`))
});

gulp.task('copy-docs', function () {
    gulp.src(['docs/**/*'])
        .pipe(gulp.dest(`${BUILD_DIR}/docs`))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function () {
    gulp.src(['img/**/*', '!img/photos/elsa/unused/**/*'])
        .pipe(gulp.dest(`${BUILD_DIR}/img`))

    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest(`${BUILD_DIR}/vendor/bootstrap`))

    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest(`${BUILD_DIR}/vendor/jquery`))

    gulp.src(['node_modules/jquery-validation/dist/jquery.validate.js', 'node_modules/jquery-validation/dist/jquery.validate.min.js'])
        .pipe(gulp.dest(`${BUILD_DIR}/vendor/jquery-validation`))

    gulp.src(['node_modules/twitter-bootstrap-wizard/jquery.bootstrap.wizard.js', 'node_modules/twitter-bootstrap-wizard/jquery.bootstrap.wizard.min.js'])
        .pipe(gulp.dest(`${BUILD_DIR}/vendor/twitter-bootstrap-wizard`))

    gulp.src(['node_modules/select2/dist/**'])
        .pipe(gulp.dest(`${BUILD_DIR}/vendor/select2`))

    gulp.src(['node_modules/datatables.net/js/jquery.dataTables.js',
        'node_modules/datatables.net-bs/js/dataTables.bootstrap.js',
        'node_modules/datatables.net-bs/css/dataTables.bootstrap.css'])
        .pipe(gulp.dest(`${BUILD_DIR}/vendor/datatables`))

    gulp.src([
        'node_modules/font-awesome/**',
        '!node_modules/font-awesome/**/*.map',
        '!node_modules/font-awesome/.npmignore',
        '!node_modules/font-awesome/*.txt',
        '!node_modules/font-awesome/*.md',
        '!node_modules/font-awesome/*.json'
    ])
        .pipe(gulp.dest(`${BUILD_DIR}/vendor/font-awesome`))
})

// Run everything
gulp.task('default', ['nunjucks', 'less', 'minify-css', 'copy-js', 'minify-js', 'copy', 'copy-docs']);

// Configure the browserSync task
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: BUILD_DIR,
        },
        open: false
    })
})

// Dev task with browserSync
gulp.task('dev', ['copy', 'browserSync', 'nunjucks', 'less', 'copy-js', 'minify-css', 'minify-js', 'copy-docs'], function () {
    gulp.watch('data*', ['nunjucks']);
    gulp.watch('less/*.less', ['less', 'minify-css']);
    gulp.watch('js/*.js', ['copy-js', 'minify-js']);
    gulp.watch('pages/**/*.+(html|nunjucks)', ['nunjucks'])
    gulp.watch('templates/**/*.nunjucks', ['nunjucks'])
    // Reloads the browser whenever HTML or JS files change
    gulp.watch(BUILD_DIR + '/*.html', browserSync.reload);
    gulp.watch(BUILD_DIR + '/js/**/*.js', browserSync.reload);
});
