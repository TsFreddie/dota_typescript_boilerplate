const sass = require('node-sass');

require('dotenv').config()

module.exports = function(grunt) {
    const dotaPath = process.env.GRUNT_DOTA_PATH;
    const addonName = process.env.GRUNT_ADDON_NAME;

    if (!dotaPath || !addonName) {
        grunt.log.writeln("Please set GRUNT_DOTA_PATH and GRUNT_ADDON_NAME in environment or in a .env file");
        return;
    }

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        newer: {
            options: {
                cache: '.grunt_cache'
            }
        },
        sass: {
            options: {
                implementation: sass,
                sourceMap: false
            },
            panorama: {
                files: [{
                    expand: true,
                    cwd: './panorama/styles',
                    src: ['**/*.scss'],
                    dest: dotaPath + '/content/dota_addons/' + addonName + '/panorama/styles/custom_game',
                    ext: '.css'
                }],
            }
        },
        pug: {
            options: {
                pretty: true,
            },
            panorama: {
                files: [{
                    expand: true,
                    cwd: './panorama/layout',
                    src: ['**/*.pug', '!**/_*.pug'],
                    dest:  dotaPath + '/content/dota_addons/' + addonName + '/panorama/layout/custom_game',
                    ext: '.xml'
                }],
            }
        },
        ts: {
            panorama: {
                options: {
                    additionalFlags: '--outDir ' + '"' + dotaPath + '/content/dota_addons/' + addonName + '/panorama/scripts/custom_game"',
                    fast: "always"
                },
                tsconfig: {
                    tsconfig: 'panorama/scripts/tsconfig.json',
                    passThrough: true,
                } 
            },
            vscripts: {
                options: {
                    compiler: './node_modules/typescript-to-lua/dist/index.js',
                    additionalFlags: '--outDir ' + '"' + dotaPath + '/game/dota_addons/' + addonName + '/scripts/vscripts"',
                    fast: "always"
                },
                tsconfig: {
                    tsconfig: 'scripts/vscripts/tsconfig.json',
                    passThrough: true,
                } 
            },
        },
        copy: {
            all: {
                files: [
                    // Game files
                    {
                        expand: true,
                        src: [
                            'addoninfo.txt',
                            'scripts/**/*.txt',
                            'scripts/vscripts/**/*.lua', // Lua libraries
                            '!scripts/**/*.txt/**/*'
                        ],
                        dest: dotaPath + '/game/dota_addons/' + addonName,
                        filter: 'isFile',
                    },
                    // Game folders
                    {
                        expand: true,
                        src: [
                            'resource/**/*',
                        ],
                        dest: dotaPath + '/game/dota_addons/' + addonName + "/",
                    },

                    // Panorama uncompilable
                    {
                        expand: true,
                        cwd: './panorama/other',
                        src: [
                            '**/*', // e.g. Panorama does not compile webm files.
                        ],
                        dest: dotaPath + '/game/dota_addons/' + addonName + "/panorama/other/custom_game",

                    },

                    // Panorama compilable
                    {
                        expand: true,
                        cwd: './panorama/images',
                        src: [
                            '**/*',
                        ],
                        dest: dotaPath + '/content/dota_addons/' + addonName + "/panorama/images/custom_game/",
                    },

                    // Panorama layouts
                    {
                        expand: true,
                        cwd: './panorama/layout',
                        src: [
                            '**/*.xml',
                        ],
                        dest: dotaPath + '/content/dota_addons/' + addonName + "/panorama/layout/custom_game/",
                    },

                    // Panorama styles
                    {
                        expand: true,
                        cwd: './panorama/styles',
                        src: [
                            '**/*.css',
                        ],
                        dest: dotaPath + '/content/dota_addons/' + addonName + "/panorama/styles/custom_game/",
                    },
                    
                    // Reverse (for repository management)
                    {
                        expand: true,
                        cwd: dotaPath + '/content/dota_addons/' + addonName,
                        src: [
                            'maps/**/*',
                            'models/**/*',
                            'particles/**/*',
                        ],
                        dest: '.',
                    }
                ]
            }
        },
        clean: {
            options: {
                force: true,
            },
            cache: [
                '.tscache/**',
                '.grunt_cache/**'
            ],
            all: [
                dotaPath + '/content/dota_addons/' + addonName + '/panorama/*',
                dotaPath + '/game/dota_addons/' + addonName + '/panorama/*',
                dotaPath + '/game/dota_addons/' + addonName + '/resource/*', // Only delete content, dota might be using this folder
                dotaPath + '/game/dota_addons/' + addonName + '/scripts/*',
                dotaPath + '/game/dota_addons/' + addonName + '/addoninfo.txt',
            ]
        },

        watch: {
            dependency_sass: {
                files: ['panorama/styles/**/_*.scss'],
                tasks: ['sass:panorama'],
            },
            dependency_pug: {
                files: ['panorama/layout/**/_*.pug'],
                tasks: ['pug:panorama'],
            },
            sass: {
                files: ['panorama/styles/**/*.scss', '!panorama/styles/**/_*.scss'],
                tasks: ['newer:sass:panorama'],
            },
            pug: {
                files: ['panorama/layout/**/*.pug', '!panorama/layout/**/_*.pug'],
                tasks: ['newer:pug:panorama'],
            },
            ts_panorama: {
                files: ['panorama/scripts/**/*.ts'],
                tasks: ['ts:panorama'],
            },
            ts_vscripts: {
                files: ['scripts/vscripts/**/*.ts'],
                tasks: ['ts:vscripts'],
            },
            ts_shared: {
                files: ['shared/**/*.ts'],
                tasks: ['ts:panorama', 'ts:vscripts'],
            },
            copy: {
                files: [
                    'addoninfo.txt',
                    'scripts/**/*.txt',
                    'scripts/**/*.txt/**/*',
                    'scripts/vscripts/**/*.lua', // Lua libraries
                    'resource/**/*',
                    'panorama/layout/*.xml',
                    'panorama/styles/*.css',
                    'panorama/other/**/*', // Panorama does not compile webm files.
                    'panorama/images/**/*',
                    dotaPath + '/content/dota_addons/' + addonName + '/maps/**/*',
                    dotaPath + '/content/dota_addons/' + addonName + '/models/**/*',
                    dotaPath + '/content/dota_addons/' + addonName + '/particles/**/*',
                ],
                tasks: ['newer:copy'],
            }
        },
    });

    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-pug');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ts');

    grunt.registerTask('kv-combine', 'Combine KV files', function() {
        const files = grunt.file.expand({filter: "isFile"}, 'scripts/**/*.txt/*.txt');
        const filemap = {};
        for (const i in files) {
            if (files[i]) {
                const filename = files[i];
                // Get components
                const match = filename.match(/^(.*\/)*(.*)\.txt\/([^\/]*\.txt)$/i);

                // No match
                if (!match) continue;

                const path = match[1];
                // Reject nested kv folders
                if (path.indexOf(".txt") > -1) continue;

                const targetFolder = match[2];
                const subFile = match[3];

                const targetFile = path+targetFolder+".txt";
                if (!(targetFile in filemap)) {
                    filemap[targetFile] = {folderName: targetFolder, files: [subFile]};

                    // Copy folder content and remove folder extension
                    grunt.log.writeln("Copying: " + path + targetFolder);
                    grunt.file.copy(path + targetFolder + ".txt", dotaPath + '/game/dota_addons/' + addonName + "/" + path + targetFolder);
                } else {
                    filemap[targetFile].files.push(subFile);
                }
            }
        }

        // Process files
        for (const file in filemap) {
            let content = "";
            const bases = filemap[file].files;
            const folder = filemap[file].folderName;
            for (const baseIndex in bases) {
                content += "#base " + '"'+ folder + '/' + bases[baseIndex] +'"\n';
            }
            grunt.log.writeln("Writing: " + file);
            grunt.file.write(dotaPath + '/game/dota_addons/' + addonName + "/" + file, content);
        }

        return true;
    });

    const buildTask = [
        'newer:sass:panorama',
        'newer:pug:panorama',
        'ts:panorama',
        'ts:vscripts',
        'newer:copy:all',
        'kv-combine',
    ];

    grunt.registerTask('default', buildTask);
    grunt.registerTask('rebuild', ['clean:cache'].concat(buildTask));
    grunt.registerTask('cache', ['clean:cache']);

};
