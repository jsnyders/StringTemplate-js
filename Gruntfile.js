module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        peg: {
            st: {
                src: "compiler/stGrammar.pegjs",
                dest: "compiler/stGrammar.js",
                options: {
                    allowedStartRules: ["groupFile", "templateFile", "templateFileRaw", "templateAndEOF"]
                }
            }
        },

        jshint: {
            options: {
                bitwise: true,
                curly: true,
                eqeqeq: true,
                indent: 4,
                plusplus: false,
                undef: true,
                unused: true,
                node: true
            },
            all: {
                options: {
                    node: true
                },
                src: [
                    "lib/*.js", "compiler/*.js",
                    "!compiler/stGrammar.js", "!compiler/groupGen_stg.js"
                ]
            }
        },

        mochaTest: {
            all: {
                options: {
                    reporter: 'spec',
                    quiet: false,
                    clearRequireCache: true
                },
                src: ['test/**/*.js']
            }
        },

        watch: {
            grammar: {
                files: ["compiler/stGrammar.pegjs"],
                tasks: ["peg"],
                options: {
                    spawn: false
                }
            },
            code: {
                files: ["lib/*.js", "compiler/*.js"],
                tasks: ["jshint"],
                options: {
                    spawn: false
                }
            },
            tests: {
                files: ["test/**/*.js", "lib/*.js", "compiler/*.js"],
                tasks: ["mochaTest"],
                options: {
                    spawn: false
                }
            }
        }

    });

    //
    // Load tasks
    //

    grunt.loadNpmTasks('grunt-peg');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.loadNpmTasks('grunt-contrib-copy'); // xxx needed?
    grunt.loadNpmTasks('grunt-contrib-uglify'); // xxx needed?

    //
    // Define tasks
    //

    // Default task(s).
    grunt.registerTask('default', ['peg', "jshint", "mochaTest"]);

};