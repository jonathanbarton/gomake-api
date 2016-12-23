import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import del from 'del';
import runSequence from 'run-sequence';
import babelCompiler from 'babel-core/register';
import * as isparta from 'isparta';
import tar from 'gulp-tar';
import Docker from 'dockerode';
import config from './src/config/env/index';
import process from 'process';

const mongoPopulator = require('gulp-mongo-populator');
const url = require('url');
const plugins = gulpLoadPlugins();
const gomakeMockData = require('gomake-mock-data');

const imageName = `gcr.io/${process.env.GCLOUD_PROJECT}/api`;

const paths = {
  js: ['src/**/*.js', '!src/server/tests/mongoMock/data.js'],
  nonJs: ['./package.json', './.gitignore'],
  tests: 'src/server/tests/unit/*.js',
  templates: 'src/server/views/**/*.jade',
  coverageTarget: ['src/server/**/*.js', '!src/server/tests/**/*.js'],
  cwd: 'src',
  tmp: 'temp',
  image: ['Dockerfile', 'gulpfile.babel.js', 'package.json', 'src']
};

const options = {
  codeCoverage: {
    reporters: ['lcov', 'text-summary'],
    thresholds: {
      global: { statements: 60, branches: 50, functions: 50, lines: 40 }
    }
  }
};

// Clean up dist and coverage directory
gulp.task('clean', () =>
  del(['dist/**', 'coverage/**', '!dist', '!coverage'])
);

// Set env variables
gulp.task('set-env', () => {
  plugins.env({
    vars: {
      NODE_ENV: 'test'
    }
  });
});

// Lint Javascript
gulp.task('lint', () =>
  gulp.src(paths.js)
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(plugins.eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(plugins.eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(plugins.eslint.failAfterError())
);

// Copy non-js files to dist
gulp.task('copy', () =>
  gulp.src(paths.nonJs)
    .pipe(plugins.newer('dist'))
    .pipe(gulp.dest('dist'))
);

// Compile ES6 to ES5 and copy to dist
gulp.task('babel', () =>
  gulp.src([...paths.js, '!gulpfile.babel.js'], { base: paths.cwd })
    .pipe(plugins.newer('dist'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.sourcemaps.write('.', {
      includeContent: false,
      sourceRoot(file) {
        return path.relative(file.path, __dirname);
      }
    }))
    .pipe(gulp.dest('dist'))
);

gulp.task('templates', ()=> {
  gulp.src(paths.templates)
    .pipe(gulp.dest('dist/server/views'))
});

// Start server with restart on file changes
gulp.task('nodemon', ['lint', 'copy', 'babel','templates'], () =>
  plugins.nodemon({
    script: path.join('dist', 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['lint', 'copy', 'babel']
  })
);

// covers files for code coverage
gulp.task('pre-test', () =>
  gulp.src([...paths.coverageTarget, '!gulpfile.babel.js'])
    // Covering files
    .pipe(plugins.istanbul({
      instrumenter: isparta.Instrumenter,
      includeUntested: true
    }))
    // Force `require` to return covered files
    .pipe(plugins.istanbul.hookRequire())
);

// triggers mocha test with code coverage
gulp.task('test', ['lint','pre-test', 'set-env'], () => {
  let reporters;
  let exitCode = 0;

  if (plugins.util.env['code-coverage-reporter']) {
    reporters = [...options.codeCoverage.reporters, plugins.util.env['code-coverage-reporter']];
  } else {
    reporters = options.codeCoverage.reporters;
  }

  return gulp.src([paths.tests], { read: false })
    .pipe(plugins.plumber())
    .pipe(plugins.mocha({
      reporter: plugins.util.env['mocha-reporter'] || 'spec',
      ui: 'bdd',
      timeout: 6000,
      compilers: {
        js: babelCompiler
      }
    }))
    .once('error', (err) => {
      plugins.util.log(err);
      exitCode = 1;
    })
    // Creating the reports after execution of test cases
    .pipe(plugins.istanbul.writeReports({
      dir: './coverage',
      reporters
    }))
    // Enforce test coverage
    .pipe(plugins.istanbul.enforceThresholds({
      thresholds: options.codeCoverage.thresholds
    }))
    .once('end', () => {
      plugins.util.log('completed !!');
      process.exit(exitCode);
    });
});

// clean dist, compile js files, copy non-js files and execute tests
gulp.task('mocha', ['clean'], () => {
  runSequence(
    ['copy', 'babel'],
    'test'
  );
});

// gulp serve for development
gulp.task('serve', ['clean'], () => runSequence('nodemon'));

const buildImage = (path, spec) => new Promise((resolve, reject) => {
  const docker = new Docker();
  docker.buildImage(path, spec, (err, response) => {
    if (err) {
      console.log(err);
    }
    response.pipe(process.stdout);
    response.on('error', reject)
    response.on('end', () => {
      console.log(`Finished building image: ${spec.t}`);
      resolve();
    });
  });
});

gulp.task('image-tar', () => {
  return gulp.src(paths.image)
    .pipe(tar('gomake-api.tar'))
    .pipe(gulp.dest(paths.tmp))
});

gulp.task('image-build', () => {
  if (typeof process.env.GCLOUD_PROJECT === 'undefined') {
    throw new Error('You must specify a $GCLOUD_PROJECT environment variable for gcloud in order to build this image.');
  }
  return buildImage(path.join(paths.tmp, 'gomake-api.tar'), {t: imageName});
});

gulp.task('image-cleanup', () => {
  del(paths.tmp);
})

gulp.task('image', () => {
  runSequence('image-tar', 'image-build', 'image-cleanup');
});

// default task: clean dist, compile js files and copy non-js files.
gulp.task('default', ['clean'], () => {
  runSequence(
    ['copy', 'babel','templates']
  );
});

//Task to populate the db with data from JSON files.It drops and repopulates as is.
//Perhaps we can have a mapping model which has jsonArray to true or false for different collections depending on the json.
gulp.task('populate', [], () => {
  let isMongoImportAllowed = toAllowMongoImportOrNot();

  if (isMongoImportAllowed) {
    let dbName = url.parse(config.db).pathname.replace(/^\//, '')
    let filePaths = gomakeMockData.getFilePaths('seeds');

    console.log(`LOG: Adding data to DB ${dbName}`);

    filePaths.forEach((filePath) => {
      console.log(`LOG: Adding data from file ${filePath}`);
      return gulp.src(filePath)
        .pipe(mongoPopulator({
          db: dbName,
          drop: true,
          file: filePath,
          jsonArray: true,
        }));
    });
  } else {
    console.log('LOG: MongoImport disabled on this environment');
  }
});

function toAllowMongoImportOrNot(){
  let env = config.env;
  let allowedEnvs = ['development','test'];
  return allowedEnvs.indexOf(env) > -1 ?  true : false;
}
