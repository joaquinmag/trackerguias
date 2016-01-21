// Imports
var debug = require('debug');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({scope: ['devDependencies'], replaceString: /\bgulp[\-.]/});
plugins.reactify = require('reactify');
plugins.browserify = require('browserify');
plugins.babelify = require('babelify');
plugins.sourceStream = require('vinyl-source-stream');
plugins.buffer = require('vinyl-buffer');

/**
 * TODO: Pull this out to somewhere where it can reside while
 * user decides what database to use.
 **/
//This is only  for  Bookshelf Dbs
gulp.task('migrate', function () {
  require('babel/register');
  require('./app/data/bookshelf/migrate')();
});

gulp.task('create-dev-db', function() {
  var conn = {
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    charset  : 'utf8'
  };
  var knex = require('knex')({ client: 'mysql', connection: conn });

  knex.raw('CREATE DATABASE trackerguias CHARACTER SET utf8')
  .then(function() {
    debug.log('dev database created');
    return knex.raw('CREATE USER \'trackerguias\'@\'localhost\' IDENTIFIED BY \'trackerguias\'');
  })
  .then(function() {
    debug.log('create db user done');
    return knex.raw('GRANT ALL ON trackerguias.* TO trackerguias@localhost');
  })
  .then(function() {
    debug.log('grant all on user done');
    knex.destroy();
  });
});

gulp.task('drop-dev-db', function() {
  var conn = {
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    charset  : 'utf8'
  };
  var knex = require('knex')({ client: 'mysql', connection: conn });

  knex.raw('DROP DATABASE trackerguias')
  .then(function() {
    return knex.raw('DROP USER \'trackerguias\'@\'localhost\'');
  })
  .then(function() {
    debug.log("dev database dropped");
    knex.destroy();
  });
});

/**
 * Tasks *
 * default: Build & start server
 * dev: Build & start server. Start watching file changes and live reload browser if frontend has changed
 * debug: Run lint and tests, build and serve
 * lint: run JSHint on JS files
 **/

gulp.task('default', ['dev-env', 'build', 'serve']);
gulp.task('build', ['scripts', 'styles']);
gulp.task('dev', ['dev-env', 'lint', 'build', 'serve']);
gulp.task('debug', ['dev-env', 'lint', 'runTests', 'build', 'serve']);
gulp.task('test', ['runTests']);
gulp.task('ci', ['lint', 'runTests', 'build']);

var paths = {
  server: {
    js: 'run.js',
    specs: 'spec/**/*.spec.js'
  },
  sources: ['app/**/*.js', 'app/**/*.jsx'],
  styles: 'public/stylesheets/**/*.css',
  views: 'views/**/*.handlebars',
  client: {
    main: './app/render/client.js',
    build: './public/build/',
    basedir: './public/javascripts/'
  }
};

gulp.task('dev-env', function() {
  return plugins.env.set({ NODE_ENV: 'development' })
    .pipe(plugins.notify({message: 'using development environment'}));
});

//run app using nodemon
gulp.task('serve', function () {
  plugins.nodemon({
    script: paths.server.js,
    ignore: ['public/build/**', '*.xml', 'node_modules/**']
  });
  gulp.watch(paths.views, ['views']);
  gulp.watch(paths.sources, ['scripts']);
  gulp.watch(paths.styles, ['styles']);
});

gulp.task('views', function() {
  return gulp.src(paths.views)
    .pipe(plugins.livereload())
    .pipe(plugins.notify({message: 'Views reloading done'}));
});

// Run Javascript linter
gulp.task('lint', function () {
  return gulp.src(['app/**/*.js', 'spec/**/*.js', 'app.js', '!spec/coverage/**'])
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format())
      .pipe(plugins.eslint.failOnError());
});

// Browserify frontend code and compile React JSX files.
gulp.task('scripts', function () {
  return plugins.browserify(paths.client.main, {debug: true})
      .transform(plugins.babelify)
      .transform(plugins.reactify)
      .bundle()
      .pipe(plugins.sourceStream('js.js'))
      .pipe(plugins.buffer())
      .pipe(plugins.sourcemaps.init({loadMaps: true}))
      .pipe(plugins.if((process.env.NODE_ENV === 'development'), plugins.beautify(), plugins.uglify()))
      .pipe(plugins.sourcemaps.write('./'))
      .pipe(gulp.dest(paths.client.build))
      .pipe(plugins.livereload())
      .pipe(plugins.notify({message: 'scripts reloading done'}));
});

// Compile CSS file from less styles
gulp.task('styles', function () {
  return gulp.src(['public/stylesheets/style.css'])
      .pipe(plugins.if((process.env.NODE_ENV === 'development'), plugins.cssbeautify(), plugins.minifyCss()))
      .pipe(gulp.dest(paths.client.build))
      .pipe(plugins.livereload())
      .pipe(plugins.notify({message: 'styles reloading done'}));
});

// livereload browser on client app changes
gulp.task('livereload', function () {
  plugins.livereload.listen({auto: true});
});

// Run tests
gulp.task('runTests',
    plugins.jsxCoverage.createTask(
        {
          src: 'spec/**/*.spec.js',
          istanbul: {
            exclude: /node_modules|test[0-9]/,
            coverageVariable: '$$cov_' + new Date().getTime() + '$$',
            includeUntested: true
          },
          transpile: {
            babel: {
              include: /\.jsx?$/,
              exclude: /node_modules/
            }
          },
          coverage: {
            reporters: ['lcov', 'text'],
            directory: 'spec/coverage'
          },
          mocha: {
            reporter: 'spec'
          },
          babel: {
            sourceMap: 'both'
          }
        }
    )
);

gulp.task('coveralls', function () {
  return gulp.src('./spec/coverage/lcov.info')
      .pipe(plugins.coveralls());
});
