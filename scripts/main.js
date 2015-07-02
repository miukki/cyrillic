requirejs.config({
//enforceDefine: true,
  paths: {
    cyrillic: 'Controllers/cyrillic',
    jquery: '../bower_components/jquery/dist/jquery'

  }
});


require(['cyrillic'], function(cyrillic){

 cyrillic.init();

});
