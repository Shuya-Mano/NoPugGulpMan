/* constiables */
const { src, dest, watch, series, parallel } = require("gulp");
//related css
const sass = require("gulp-dart-sass");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const sassGlob = require("gulp-sass-glob-use-forward");
const cleanCSS = require("gulp-clean-css");

//related images
const changed = require("gulp-changed");
const imagemin = require("gulp-imagemin");
const imageminJpg = require("imagemin-jpeg-recompress");
const imageminPng = require("imagemin-pngquant");
const imageminGif = require("imagemin-gifsicle");
const svgmin = require("gulp-svgmin");

//related js
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");

const notify = require("gulp-notify");

// const pug = require("gulp-pug");

// const data = require("gulp-data");
// const fs = require("fs");

const webp = require("gulp-webp");

const prettier = require("gulp-prettier");
const pugBeautify = require("gulp-pug-beautify");

//related server
const browserSync = require("browser-sync");

const srcDir = {
  default: "./src/assets",
};

const destDir = {
  default: "./asset",
  css: "./asset/css",
};

// const compilePug = (done) => {
//   src(["./src/assets/pug/**/*.pug", "!./src/assets" + "/pug/**/_*.pug"])
//     .pipe(
//       plumber({
//         errorHandler: notify.onError({
//           title: "ワンワン(Pugエラー)",
//           icon: "./src/assets/pug/hurentiburuDog.png",
//           message: "<%= error.message %>",
//         }),
//       })
//     )
//     .pipe(
//       data(function (file) {
//         return JSON.parse(fs.readFileSync("./src/assets/pug/_data.json"));
//       })
//     )
//     .pipe(
//       pug({
//         pretty: true,
//         basedir: "./assets/pug",
//       })
//     )

//     .pipe(
//       pugBeautify({
//         fill_tab: true,
//         omit_div: true,
//         tab_size: 4,
//         width: 120,
//       })
//     )
//     .pipe(dest(`./`))
//     .on("end", function () {
//       console.log("  (´･ω･`)          pugコンパイル完了！");
//       console.log("＿(__つ/￣￣￣/＿  おめでとう！");
//       console.log("   ＼/        /)   (エラーがないとは言ってない)");
//       console.log("      ￣￣￣￣ ");
//     });
//   done();
// };

/* Functions */
// Sass
sass.compiler = require("sass");
const compileSass = (done) => {
  src(`${srcDir.default}/sass/**/*.scss`)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "ワンワン(Scssエラー)",
          icon: "./src/assets/pug/hurentiburuDog.png",
          message: "<%= error.message %>",
        }),
      })
    )
    .pipe(sassGlob())
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "expanded",
      })
    )
    .pipe(autoprefixer())
    .pipe(
      prettier({
        parser: "scss",
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        singleQuote: true,
        trailingComma: "none",
        bracketSpacing: true,
      })
    )
    .pipe(sourcemaps.write("./"))
    .pipe(dest(`${destDir.css}`))
    .on("end", function () {
      console.log("  (´･ω･`)          Scssコンパイル完了！");
      console.log("＿(__つ/￣￣￣/＿  おめでとう！");
      console.log("   ＼/        /)   (エラーがないとは言ってない)");
      console.log("      ￣￣￣￣ ");
    });
  done();
};

const compressCss = (done) => {
  src(`${destDir.css}/style.css`)
    .pipe(plumber())
    .pipe(cleanCSS())
    .pipe(rename("style.min.css"))
    .pipe(dest(`${destDir.css}`));
  done();
};

const imageMin = (done) => {
  // jpeg,png,gif
  src(`./src/assets/img/**.+(jpg|JPG|jpeg|png|gif)`)
    .pipe(changed(`./asset/img`))
    .pipe(
      imagemin([
        imageminPng(),
        imageminJpg(),
        imageminGif({
          interlaced: false,
          optimizationLevel: 3,
          colors: 180,
        }),
      ])
    )
    .pipe(dest(`./asset/img`));
  done();
  // svg
  src(`./src/assets/img/**.+(svg)`)
    .pipe(changed(`./asset/img`))
    .pipe(svgmin())
    .pipe(dest(`./asset/img`));

  done();

  src(`./src/assets/img/**.+(jpg|JPG|jpeg|png|gif)`)
    .pipe(changed(`./asset/img`))
    .pipe(
      rename((path) => {
        path.basename += path.extname;
      })
    )
    .pipe(
      webp({
        quality: 70,
        method: 6,
      })
    )

    .pipe(dest(`./asset/img`));
  done();
};

// concat js file(s)
const concatJs = (done) => {
  src(`${srcDir.default}/js/**.js`)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "ワンワン(JavaScriptエラー)",
          icon: "./src/assets/pug/hurentiburuDog.png",
          message: "<%= error.message %>",
        }),
      })
    )
    .pipe(concat("common.js"))
    .pipe(dest(`${destDir.default}/js`))
    .on("end", function () {
      console.log("  (´･ω･`)          JavaScriptコンパイル完了！");
      console.log("＿(__つ/￣￣￣/＿  おめでとう！");
      console.log("   ＼/        /)   (エラーがないとは言ってない)");
      console.log("      ￣￣￣￣ ");
    });
  done();
};

// compress js file(s)
const compressJs = (done) => {
  src(`${destDir.default}/js/common.js`)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename("common.min.js"))
    .pipe(dest(`${destDir.default}/js`));
  done();
};

// Browser Sync
const browserSyncFunc = (done) => {
  browserSync.init({
    server: {
      baseDir: `./`,
      index: "/index.html",
    },
  });

  // WordPress使用時にコメントアウト外す
  // browserSync.init({
  // 	proxy: "http://palmedicalcheckup.local/", // ローカルにある「Site Domain」に合わせる
  // 	notify: false,
  // 	open: "external",
  // });
  done();
};

// Reload Browser
const reloadBrowser = (done) => {
  browserSync.reload();
  done();
};

//
// Default task
//
const watchFiles = (done) => {
  // watch(`${destDir.default}/**/*.html`, reloadBrowser);
  // watch(`${srcDir.default}/pug/**/*.pug`, series(compilePug, reloadBrowser));
  watch(
    `${srcDir.default}/sass/**/*.scss`,
    series(compileSass, compressCss, reloadBrowser)
  );
  watch(
    `${srcDir.default}/js/*.js`,
    series(concatJs, compressJs, reloadBrowser)
  );
  watch(`${srcDir.default}/img/*`, series(imageMin, reloadBrowser));
  // watch("./**", reloadBrowser); //WordPress時のリロード（自作のため動作するかは不明）
  done();
};

exports.default = parallel(
  // compilePug,
  compileSass,
  concatJs,
  compressJs,
  watchFiles,
  browserSyncFunc
);

exports.imagemin = parallel(imageMin);

// exports.minify = parallel(compressCss , compressJs);
