+(function($) {
  $(document).ready(function() {
    var mainLayoutSettings = {
      default: {
        fxName: 'slide',
        fxSpeed: 'normal'
      },
      east: {
        minSize: 300,
        size: 350,
      },
      west: {
        minSize: 200,
        size: 250,
      },
      south: {
        closable: false,
        resizable: false
      }
    };

    $('#workbench').layout(mainLayoutSettings);
  });
}(jQuery));

// vi:ft=javascript ts=2 sw=2 et :
