module.exports = function(grunt) {

  grunt.initConfig({
    // manifest file
    pkg : grunt.file.readJSON('package.json'),

    /**
     * The path of the assets to compile
     *
     * @var string
     */
    srcPath : 'src',

    /**
     * The path of the compiled build
     *
     * @var string
     */
    buildPath : 'build',

    /**
     * The path of the vendor directory
     *
     * @var string
     */
    vendorPath : 'vendor',

    /**
     * The path to the soundmanager2 file
     *
     * @var string
     */
    sm2SourceFile : '<%= vendorPath %>/soundmanager2/script/soundmanager2.js',

    /**
     * Clean folders
     *
     * @task clean
     */
    clean : {
      build : {
        src : ['<%= buildPath %>/']
      }
    },

    /**
     * Copies the SoundManager2 SWF files into the /build/swf/ directory
     *
     * @task copy
     */
    copy : {
      build : {
        expand : true,
        cwd : '<%= vendorPath %>/soundmanager2/swf/',
        src : ['*.swf'],
        dest : '<%= buildPath %>/swf/'
      }
    },

    /**
     * Concatenate the source files into a single file
     *
     * @task concat
     */
    concat : {
      options : {
        separator : ';',
      },
      build : {
        src : ['<%= sm2SourceFile %>', '<%= srcPath %>/**/*.js'],
        dest : '<%= buildPath %>/js/soundcloud.js'
      }
    },

    /**
     * Uglifies the concatenated JS file into a minified file
     *
     * @task uglify
     */
    uglify : {
      options : {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n\n @author Vu Tran \n @link <http://vu-tran.com> \n @package <%= pkg.name %> \n @license <%= pkg.license %> \n*/\n'
      },
      build : {
        expand : true,
        cwd : '<%= buildPath %>/js/',
        src : ['**/*.js'],
        dest : '<%= buildPath %>/js/',
        ext : '.min.js'
      }
    }

  });

  // Load Plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Register Tasks
  grunt.registerTask('default', ['clean', 'copy', 'concat']);
  grunt.registerTask('full', ['clean', 'copy', 'concat', 'uglify']);

};