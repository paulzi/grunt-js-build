# grunt-js-build

Concat all files in each folder in src, and make umd module.

Example of structure:
```
frontend/
    src/
        _includes/
        common/
            es5-shim.js
            request-animation-frame-polyfill.js
        product/
            _config.js
            $after.js
            main.js
            carousel.js
    web/
        js/
            common.js   // output file
            product.js  // output file
```


Gruntfile.js example:

```javascript
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jsBuild: {
            frontend: {
                src: 'frontend/src',
                dest: 'frontend/web/js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-js-build');

    grunt.registerTask('default', ['jsBuild']);
};
```

## options
`$before`, `$after` - special filename for concat in begin/end of file
`_*.js` - files with underscore is not concatenate
`_config.js` - you can specify custom concat order (or concat external files), also you must define UMD module params

Example of _config.js:
```javascript
module.exports = function (grunt, dest, name) {
    return {
        concat: ['../_includes/EventObject.js', 'main.js', ''*.js'],
        umd: {
            objectToExport: 'Example',
            amdModuleId: 'example',
            deps: {
                'default': [{'jquery': '$'}],
                global: ['root.jQuery']
            }
        }
    };
};
```

See UMD config here: (https://github.com/bebraw/grunt-umd)[https://github.com/bebraw/grunt-umd]