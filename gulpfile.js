const path = require("path");
const { src, dest, series } = require("gulp");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");
const htmlclean = require("gulp-htmlclean");
const minifyCss = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const babel = require("gulp-babel");
// const useref = require('gulp-useref');
// const gulpif = require('gulp-if');

const destPath = path.join(__dirname, "public");

function minifyHtml() {
  return (
    src(destPath + "/**/*.html")
      .pipe(htmlclean())
      // .pipe(useref())
      // .pipe(gulpif('*.js', babel({
      //     presets: ["@babel/env"]
      //   })))
      // .pipe(gulpif('*.js', uglify()))
      // .pipe(gulpif('*.css', minifyCss()))
      .pipe(
        htmlmin({
          collapseWhitespace: true,
          removeComments: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeTagWhitespace: true,
          removeEmptyAttributes: true,
          minifyCSS: true,
          minifyJS: true,
          sortAttributes: true,
          sortClassName: true,
          useShortDoctype: true
        })
      )
      .pipe(dest(destPath))
  );
}

function minifyStyle() {
  return src(destPath + "/**/*.css")
    .pipe(minifyCss({ compatibility: "ie8" }))
    .pipe(dest(destPath));
}

function minifyJs() {
  return src(destPath + "/js/**/*.js")
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(uglify())
    .pipe(dest(destPath + "/js"));
}

function minifyImg() {
  return src(destPath + "/img/**/*.*")
    .pipe(imagemin())
    .pipe(dest(destPath + "/img"));
}

exports.html = minifyHtml;
exports.js = minifyJs;
exports.css = minifyStyle;
exports.img = minifyImg;
exports.build = series(minifyHtml, minifyStyle, minifyJs, minifyImg);
