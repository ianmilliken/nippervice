import gulp from "gulp";
import cp from "child_process";
import gutil from "gulp-util";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import postcss from "gulp-postcss";
import cssImport from "postcss-import";
import cssnext from "postcss-cssnext";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";

const browserSync = BrowserSync.create();
const hugoBin = "hugo";
const defaultArgs = ["-d", "../dist", "-s", "site", "-v"];

gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, ["--buildDrafts", "--buildFuture"]));

// gulp.task("build", ["css", "js", "hugo"]);
// gulp.task("build-preview", ["css", "js", "hugo-preview"]);
gulp.task("build", ["sass", "fonts", "js", "hugo"]);
gulp.task("build-preview", ["sass", "fonts", "js", "hugo-preview"]);

// CSS
gulp.task("css", () => (
  gulp.src("./src/css/*.css")
    .pipe(postcss([cssImport({from: "./src/css/main.css"}), cssnext()]))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream())
));

// SCSS
gulp.task("sass", () => (
  gulp.src("./src/sass/*.scss")
  .pipe(sass({
    outputStyle : "compressed"
  }))
  .pipe(autoprefixer({
    browsers : ["last 20 versions"]
  }))
  .pipe(gulp.dest("./dist/css"))
  .pipe(browserSync.stream())
));

// FONTS
gulp.task("fonts", () => (
  gulp.src("./node_modules/font-awesome/fonts/**.*")
    .pipe(gulp.dest('./dist/fonts'))
    .pipe(browserSync.stream())
));

// JS
gulp.task("js", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
});

// SERVER
// gulp.task("server", ["hugo", "css", "js"], () => {
gulp.task("server", ["hugo", "sass", "fonts", "js"], () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch("./src/js/**/*.js", ["js"]);
  // gulp.watch("./src/css/**/*.css", ["css"]);
  gulp.watch("./src/sass/**/*.scss", ["sass"]);
  gulp.watch("./site/**/*", ["hugo"]);
});

// BUILD
function buildSite(cb, options) {
  const args = options ? defaultArgs.concat(options) : defaultArgs;

  return cp.spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}
