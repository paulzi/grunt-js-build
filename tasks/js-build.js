'use strict';

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-umd');

    grunt.registerMultiTask('jsBuild', 'Build js from folders.', function () {
        var src, dest, path;
        path = require('path');
        src  = this.data.src;
        dest = this.data.dest;
        grunt.file.expand(src + "/*").forEach(function (dir) {
            var dirName, configFile, config, target, concatList, taskConfig, taskName;

            if (!grunt.file.isDir(dir)) {
                return;
            }

            dirName = dir.substr(dir.lastIndexOf('/') + 1);
            if (dirName.substr(0, 1) === '_') {
                return;
            }
            configFile = [src, dirName, '_config.js'].join('/');
            configFile = path.resolve(process.cwd(), configFile);
            if (grunt.file.exists(configFile)) {
                config = require(configFile)(grunt, dest, dirName);
            } else {
                config = {};
            }

            target   = config.dest || (dest + '/' + dirName + '.js');
            taskName = 'js-build-' + dirName;

            // concat list
            concatList = config.concat || ['*.js'];
            concatList = ['$before.js'].concat(concatList).concat(['!$after.js', '$after.js', '!_*.js']);
            concatList = concatList.map(function (item) {
                return item.charAt(0) === '!' ? '!' + dir + '/' + item.substr(1) : dir + '/' + item;
            });

            // concat
            taskConfig = grunt.config.get('concat') || {};
            taskConfig[taskName] = {
                options: {
                    banner: "'use strict';\n"
                },
                src: concatList,
                dest: target
            };
            grunt.config.set('concat', taskConfig);
            grunt.task.run(['concat:' + taskName]);

            // umd
            if (config.umd) {
                taskConfig = grunt.config.get('umd') || {};
                config.umd.src = config.umd.src || target;
                taskConfig[taskName] = { options: config.umd };
                grunt.config.set('umd', taskConfig);
                grunt.task.run(['umd:' + taskName]);
            }
        });
    });
};