module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

		connect: {
      server: {
        options: {
  			hostname: 'new.local',
        port: 9001,
        base: '.',
  			keepalive: true
        }
      }
		},

		pkg: grunt.file.readJSON('package.json'),

  });

  //tasks task
  grunt.registerTask('default', ['']);
};
