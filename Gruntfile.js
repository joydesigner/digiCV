/**
 * Created by Xin on 2015/2/23.
 */
/**
 * Created by xinzheng on 15/11/2014.
 */

module.exports = function(grunt){
    //project config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify:{
            options: {
                mangle: true,
                compress: true,
                sourceMap: "js/app.map",
                banner: '/*Jason Zheng - ! <%= pkg.name %> | <%= pkg.author %> | <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            target: {
                src: "js/app.js",
                dest: "js/app.min.js"
            }
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc",
                globals: true
            },
            target: {
                src: "js/app.js"
            }
        },
        cssmin:{
            target: {
                files:[{
                    expand: true,
                    cwd: 'css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'css/',
                    ext:'.min.css'
                }]
            }
        },
        less: {
            development:{
                options: {
                    paths: ["css/less"],
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    // destination file and source file
                    "css/style.css": "css/less/style.less"
                }
            }
        },
        watch: {
            files: "./css/less/*",
            tasks: ['less','cssmin'],
            options: {
                spawn: false
            }
        },
        clean: {
            target: ['css/*.min.css']
        },

        connect: {
            server: {
                options: {
                    port: 9001
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('default', "Automated tasks are running...",['jshint','clean','less','uglify','cssmin','watch','connect:tests:keepalive']);
};




