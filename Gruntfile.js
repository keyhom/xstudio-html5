/*jshint expr:true*/
/*global module:false, process:false */
module.exports = function(grunt) {
    'use strict';

    // Project Configuration.
    grunt.initConfig({
        banner: '/*!\n' +
		' * XStudio Lite v<%= pkg.version %> \n' +
		' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
		' * Licensed under the <%= pkg.license.type %> license (<%= pkg.license.url %>)\n' +
		' */\n',
        jqueryCheck: 'if (typeof jQuery === \'undefined\') { throw new Error(\'Fuel UX\\\'s JavaScript requires jQuery\') }\n\n',
        bootstrapCheck: 'if (typeof jQuery.fn.dropdown === \'undefined\' || typeof jQuery.fn.collapse === \'undefined\') ' +
		'{ throw new Error(\'Fuel UX\\\'s JavaScript requires Bootstrap\') }\n\n',
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%=pkg.name %> <%=grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%=pkg.name %>.js',
                dest: 'build/<%=pkg.name %>.min.js'
            }
        },
        clean: {
            dist: ['dist'],
            zipsrc: ['dist/xstudio-lite']
        },
        compress: {
            zip: {
                files: [{
                    cwd: 'dist/',
                    expand: true,
                    src: ['xstudio-lite/**']
                }],
                options: {
                    archive: 'dist/xstudio-lite.zip',
                    mode: 'zip'
                }
            }
        },
        concat: {
            dist: {
                files: {
                    // manually concatenate JS files (due to dependency management)
                    'dist/js/xstudio.js': [
                        'js/checkbox.js',
                        'js/combobox.js'
                    ]
                },
                options: {
                    banner: '<%=banner %>' + '\n\n' +
                    '(function(factory) {\n' +
                    '\tif (typeof define === \'function\' && define.amd) {\n' +
                    '\t\tdefine([\'jquery\',\'bootstrap\'], factory);\n' +
                    '\t} else {\n}' +
                    '\t\tfactory(jQuery);\n' +
                    '\t}\n' +
                    '}(function (jQuery) {\n\n' +
                    '<%= jqueryCheck %>' +
                    '<%= bootstrapCheck %>',
                    footer: '\n}));',
                    process: function(source) {
                        source = '(function ($) {\n\n)' +
                        source.replace(/\/\/ -- BEGIN UMD WRAPPER PREFACE --(\n|.)*\/\/ -- END UMD WRAPPER PREFACE --/g, '') ;
                        source = source.replace(/\/\/ -- BEGIN UMD WRAPPER ATERWORD --(\n|.)*\/\/ -- END UMD WRAPPER AFTERWORD --/g, '') + '\n})(jQuery);\n\n';
                        return source;
                    }
                }
            }
        },
        connect: {
            server: {
                optoins: {
                    hostname: '*',
                    port: 8000
                }
            },
            testServer: {
                options: {
                    hostname: '*',
                    port: 9000 // allows main server to be run simultaneously
                }
            }
        },
        copy: {
            fonts: {
                cwd: 'font/',
                dest: 'dist/fonts',
                expand: true,
                filter: 'isFile',
                src: ['*']
            },
            zipsrc: {
                cwd: 'dist/',
                dest: 'dist/xstudio/',
                expand: true,
                src: ['**']
            }
        },
        jsbeautifier: {
            files: ['dist/js/xstudio.js'],
            options: {
                js: {
                    braceStyle: 'collapse',
                    breakChainedMethods: false,
                    e4x: false,
                    evalCode: false,
                    indentLevel: 0,
                    indentSize: 4,
                    indentWithTabs: true,
                    jslintHappy: false,
                    keepArrayIndentation: false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    spaceBeforeConditional: true,
                    spaceInParen: true,
                    unescapeStrings: false,
                    wrapLineLength: 0
                }
            }
        },
        jshint: {
            options: {
                boss: true,
                browser: true,
                curly: false,
                eqeqeq: true,
                eqnull: true,
                globals: {
                    jQuery: true,
                    define: true,
                    require: true
                },
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: false
            },
            source: ['Grunfile.js', 'js/*.js', 'dist/xstudio.js'],
            tests: {
                options: {
                    latedef: false,
                    undef: false,
                    unused: false
                },
                files: {
                    src: ['test/**/*.js']
                }
            }
        },
        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: [
                        'dist/css/<%= pkg.name %>.css',
                        'dist/css/<%= pkg.name %>.min.css'
                    ]
                }
            }
        },
        watch: {
            full: {
                files: ['Grunfile.js', 'fonts/**', 'js/**', 'less/**', 'lib/**', 'test/**', 'index.html'],
                options: {
                    livereload: true
                },
                tasks: ['test', 'dist']
            },
            css: {
                files: ['Grunfile.js', 'fonts/**', 'js/**', 'less/**', 'lib/**', 'test/**', 'index.html'],
                options: {
                    livereload: true
                },
                tasks: ['distcss']
            },
            contrib: {
                files: ['Grunfile.js', 'fonts/**', 'js/**', 'less/**', 'lib/**', 'test/**', 'index.html'],
                options: {
                    livereload: true
                },
                tasks: ['test']
            }
        },
        express: {
            options: {
                // Override defaults here.
                port: 8082
            },
            dev: {
                options: {
                    script: 'devserver.js'
                }
            }
        }
    });

    // Load all grunt plugins in one line from package.json
    require('load-grunt-tasks')(grunt, {
        scope: 'devDependencies'
    });

    // Load the plugin that provides the 'uglify' task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

    //------------------------------
    // Build Phases
    //------------------------------

    // JS distribution task.
    grunt.registerTask('distjs', 'concat, uglify and beautifying JS.', ['concat', 'uglify', 'jsbeautifier']);
    // CSS distribution task
    grunt.registerTask('distcss', 'less compile CSS', ['less', 'usebannder']);
    // Full distribution task
    grunt.registerTask('dist', 'build and zip dist --contributors should do this!!!', ['clean:dist', 'distcss', 'copy:fonts', 'distjs', 'distzip']);

    //------------------------------
    // Serve
    //------------------------------

    grunt.registerTask('serve', 'serve files without compilation', ['test', 'connect:server', 'watch:contrib']);
    grunt.registerTask('servefast', 'serve files without compilation or watch (tests take time...)', ['connect:server']);
    grunt.registerTask('servedist', 'build dist directory and serve files with compilation', ['test', 'dist', 'connect:server', 'watch:full']);
    grunt.registerTask('dev', ['express:dev', 'watch:contrib']);
};
