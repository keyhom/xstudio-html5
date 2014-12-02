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
        plexusBanner: '/*!\n' +
                         ' * Plexus Lite v<%= pkg.version %> \n' +
                         ' * Copyright 2014-<%=grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
                         ' * Licensed under the <%= pkg.license.type %> license (<%= pkg.license.url %>)\n' +
                         ' */\n',
        jqueryCheck: 'if (typeof jQuery === \'undefined\') { throw new Error(\'Requires jQuery\') }\n\n',
        bootstrapCheck: 'if (typeof jQuery.fn.dropdown === \'undefined\' || typeof jQuery.fn.collapse === \'undefined\') ' +
		'{ throw new Error(\'Requires Bootstrap\') }\n\n',
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%=pkg.name %> <%=grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/js/<%=pkg.name %>.js',
                dest: 'dist/js/<%=pkg.name %>.min.js'
            }
        },
        clean: {
            dist: ['dist'],
            zipsrc: ['dist/xstudio']
        },
        compress: {
            zip: {
                files: [{
                    cwd: 'dist/',
                    expand: true,
                    src: ['xstudio/**']
                }],
                options: {
                    archive: 'dist/xstudio.zip',
                    mode: 'zip'
                }
            }
        },
        concat: {
            options: {
                stripBanners: false,
                separator: ';'
            },
            plexus: {
                options: {
                    banner: '<%= plexusBanner %>\n'
                },
                src: [
                    'src/plexus/js/plexus-base.js',
                    'src/plexus/js/components.js'
                ],
                dest: 'build/js/plexus.js'
            },
            studio: {
                options: {
                    banner: '<%= banner %>\n\n' +
                   '(function(factory) {\n' +
                   '\tif (typeof define === \'function\' && define.amd) {\n' +
                   '\t\tdefine([\'jquery\',\'bootstrap\'], factory);\n' +
                   '\t} else {\n' +
                   '\t\tfactory(jQuery);\n' +
                   '\t}\n' +
                   '}(function (jQuery) {\n\n' +
                   '<%= jqueryCheck %>' +
                   '<%= bootstrapCheck %>',
                   footer: '\n}));',
                   process: function(source) {
                       source = '+(function ($) {\n\n' +
                       source.replace(/\/\/ -- BEGIN UMD WRAPPER PREFACE --(\n|.)*\/\/ -- END UMD WRAPPER PREFACE --/g, '') ;
                       source = source.replace(/\/\/ -- BEGIN UMD WRAPPER ATERWORD --(\n|.)*\/\/ -- END UMD WRAPPER AFTERWORD --/g, '') + '\n})(jQuery);\n\n';
                       return source;
                   }
                },
                src: [
                    'src/studio/js/hierarchy.js',
                    'src/studio/js/studio-layouts.js',
                    'src/studio/js/studio-jqlayout.js',
                    'src/studio/js/studio-autoheight.js'
                ],
                dest: 'build/js/studio.js'
            }
//            dist: {
//                files: {
//                    // manually concatenate JS files (due to dependency management)
//                    'dist/js/xstudio.js': [
//                        'src/js/checkbox.js',
//                        'src/js/combobox.js'
//                    ]
//                },
//                options: {
//                    banner: '<%=banner %>' + '\n\n' +
//                    '(function(factory) {\n' +
//                    '\tif (typeof define === \'function\' && define.amd) {\n' +
//                    '\t\tdefine([\'jquery\',\'bootstrap\'], factory);\n' +
//                    '\t} else {\n' +
//                    '\t\tfactory(jQuery);\n' +
//                    '\t}\n' +
//                    '}(function (jQuery) {\n\n' +
//                    '<%= jqueryCheck %>' +
//                    '<%= bootstrapCheck %>',
//                    footer: '\n}));',
//                    process: function(source) {
//                        source = '(function ($) {\n\n)' +
//                        source.replace(/\/\/ -- BEGIN UMD WRAPPER PREFACE --(\n|.)*\/\/ -- END UMD WRAPPER PREFACE --/g, '') ;
//                        source = source.replace(/\/\/ -- BEGIN UMD WRAPPER ATERWORD --(\n|.)*\/\/ -- END UMD WRAPPER AFTERWORD --/g, '') + '\n})(jQuery);\n\n';
//                        return source;
//                    }
//                }
//            }
        },
        copy: {
            third_party: {
                cwd: 'src/third_party/',
                dest: 'build/',
                expand: true,
                src: ['**']
            },
            main: {
                cwd: 'src/main/',
                dest: 'build/',
                expand: true,
                src: ['**']
            },
            html: {
                cwd: '.',
                dest: 'build/',
                expand: true,
                src: ['*.html', 'src/main/**/*.html']
            },
            res: {
                cwd: 'res/',
                dest: 'build/res/',
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
        less: {
            compileTheme: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: '<%= pkg.name %>-theme.css.map',
                    sourceMapFilename: 'build/css/<%= pkg.name %>-theme.css.map'
                },
                src: ['src/main/less/variables.less', 'src/main/less/bootswatch.less', 'src/main/less/fancytree.less'],
                dest: 'build/css/<%= pkg.name %>-theme.css'
            }
        },
        watch: {
            options: {
                livereload: true
            },
            res: {
                files: ['res/**'],
                tasks: ['copy:res']
            },
            web: {
                files: ['Grunfile.js', 'src/**', 'index.html'],
                options: {
                    livereload: true
                },
                tasks: ['make']
            }
        },
        express: {
            options: {
                // Override defaults here.
            },
            web: {
                options: {
                    port: 8081,
                    server: 'src/server/devserver',
                    bases: ['build'],
                    livereload: true,
                    servereload: true
                }
            }
        }
    });

    // Load all grunt plugins in one line from package.json
    require('load-grunt-tasks')(grunt, {
        scope: 'devDependencies'
    });

    // Load the plugin that provides the 'uglify' task.
    // grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    // grunt.registerTask('default', ['uglify']);

    //------------------------------
    // Build Phases
    //------------------------------

    // JS distribution task.
    // grunt.registerTask('distjs', 'concat, uglify and beautifying JS.', ['concat', 'uglify', 'jsbeautifier']);
    // CSS distribution task
    // grunt.registerTask('distcss', 'less compile CSS', ['less', 'usebannder']);
    // Full distribution task
    // grunt.registerTask('dist', 'build and zip dist --contributors should do this!!!', ['clean:dist', 'distcss', 'copy:fonts', 'distjs', 'distzip']);

    //------------------------------
    // Serve
    //------------------------------

    grunt.registerTask('make', ['copy', 'concat', 'less']);
    // grunt.registerTask('web', 'Lanch webserver and watch tasks.', ['parallel:web']);
    grunt.registerTask('web', 'Lauch webserver and watch tasks.', ['express:web', 'watch:web']);
};

// vi:ft=javascript ts=4 sw=4 et :
