const gulp = require('gulp')
const babel = require('gulp-babel')
const del = require('del')


const globs = 'src/**/*.js'

const babelrc = () => babel({
  presets: ['es2015', 'stage-3'],
  plugins: [
    ['module-alias', [
      { src: './src', 'expose': '@root' },
      { src: './src/recipes', 'expose': '@recipes' },
    ]],
  ],
})


gulp.task('clean', () => {
  return del([
    'recipes',
    'index.js',
    'utils.js',
    'template.js',
  ])
})

gulp.task('build', () => {
  gulp.src(globs)
    .pipe(babelrc())
    .pipe(gulp.dest('./'))
})

gulp.task('default', () =>
  gulp.watch(globs, ['build'])
)



