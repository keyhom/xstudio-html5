+(function($) {
  $(document).ready(function() {
    // Main layout settings.
    var mainLayoutSettings = {
      default: {
        fxName: 'slide',
        fxSpeed: 'normal',
        fxSettings: {
          easing: "easeOutBounce"
        }
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
        resizable: false,
        spacing_open: 0
      }
    };

    $('#workbench').layout(mainLayoutSettings);
    $('#editorView').layout({
      default:{
      },
      south: {
        size: 200,
        minSize: 150
      }
    });

    // Project Tree settings.
    $('#projectTree').fancytree();
    $('#hierarchyTree').fancytree({
      source: {
        url: "fancytree-test.json",
        complete: function() {

        }
      },
    });

  });

}(jQuery));

// vi:ft=javascript ts=2 sw=2 et :
