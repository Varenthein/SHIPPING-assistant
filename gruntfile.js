module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

   concat: {

        core: {
            src: 'app/core/*.js',
            dest: 'app/dist/core.js'
        },
        controllers: {
            src: 'app/components/**/*.js',
            dest: 'app/dist/controllers.js'
        },
        services: {
            src: 'app/services/*.js',
            dest: 'app/dist/services.js'
        }

    },

   watch: {
    scripts: {
        files: ['app/core/*.js','app/services/*.js','app/components/**/*.js'],
        tasks: ['concat'],
        options: {
            spawn: false,
        },
    }
   }


  });
  // Load the plugins tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).

  grunt.registerTask('default', ['concat', 'watch']);
};
