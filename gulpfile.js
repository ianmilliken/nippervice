var gulp         = require("gulp"),
    sass         = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    hash         = require("gulp-hash"),
    copy         = require("gulp-copy"),
    notify       = require("gulp-notify"),
    bower        = require("gulp-bower"),
    jquery       = require('gulp-jquery'),
    del          = require("del"),

    config = {
         SASS_DIR: './src/scss',
        JS_DIR: './src/js',
        IMAGE_DIR: './src/images',
         BOWER_DIR: './bower_components' 
    }

// Run Bower Install
gulp.task("bower", function() { 
    return bower()
        .pipe(gulp.dest(config.BOWER_DIR)) 
});

// Move FontAwesome into our SCSS
gulp.task("icons", function() { 
    return gulp.src(config.BOWER_DIR + '/font-awesome/fonts/**.*') 
        .pipe(gulp.dest('./static/fonts')); 
});

// Compile SCSS files to CSS
gulp.task("scss", function () {

    //Delete our old css files
    del(["static/css/**/*"])

    //compile hashed css files
    gulp.src(config.SASS_DIR + "/**/*.scss")
        .pipe(sass({
            outputStyle : "compressed",
            includePaths: [
                config.SASS_DIR,
                config.BOWER_DIR + '/font-awesome/scss'
            ]
        }))
        .on("error", notify.onError(function (error) {
            return "Error: " + error.message;
        }))
        .pipe(autoprefixer({
            browsers : ["last 20 versions"]
        }))
        .pipe(hash())
        .pipe(gulp.dest("static/css"))
        //Create a hash map
        .pipe(hash.manifest("hash.json"))
        //Put the map in the data directory
        .pipe(gulp.dest("data/css"))
})

// Hash images
gulp.task("images", function () {
    del(["static/images/**/*"])
    gulp.src(config.IMAGE_DIR + "/**/*")
        .pipe(hash())
        .pipe(gulp.dest("static/images"))
        .pipe(hash.manifest("hash.json"))
        .pipe(gulp.dest("data/images"))
})

// Hash javascript
gulp.task("js", function () {
    del(["static/js/**/*"])
    gulp.src(config.JS_DIR + "/**/*")
        .pipe(hash())
        .pipe(gulp.dest("static/js"))
        .pipe(hash.manifest("hash.json"))
        .pipe(gulp.dest("data/js"))
})

// Watch asset folder for changes
gulp.task("watch", ["scss", "images", "js"], function () {
    gulp.watch(config.SASS_DIR + "/**/*", ["scss"])
    gulp.watch(config.IMAGE_DIR + "/**/*", ["images"])
    gulp.watch(config.JS_DIR + "/**/*", ["js"])
})


// Set watch as default task
gulp.task("default", ["bower", "icons", "watch"])
