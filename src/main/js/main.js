// Main.js

console.log("Main.js [loaded]");

+(function() {
    var PlayerInputSystem = PlayerInputSystem || null;
    if (PlayerInputSystem) {
        var inputSystem = new PlayerInputSystem();
        plexus.GameSystem.getInstance().addSubSystem(inputSystem);
    }

    var AnimatorSystem = plexus.CocosAnimatorSystem || null;
    if (AnimatorSystem) {
        var animSys = new AnimatorSystem();
        plexus.GameSystem.getInstance().addSubSystem(animSys);
    }
}());

$(document.body).ready(function() {
    var testObject = new plexus.GameObject();
    $(this).bind("GameLoaded", function(event, data) {
        testObject.addComponent(new plexus.components.Input());
        testObject.addComponent(new plexus.components.Physics());
        testObject.addComponent(new plexus.components.Animator());
        testObject.setUserData(data.object);

        plexus.GameSystem.getInstance().addObject(testObject);

        console.log(testObject.getId());
    });

    $('#btnHeroIdle').click(function() {
        // noop
        var comp = testObject.getComponent('animator');
        comp && comp.setState('idle');
    });

    $('#btnHeroRun').click(function() {
        // noop
        var gs = plexus.GameSystem.getInstance();
        var comp = testObject.getComponent('animator');
        comp && comp.setState('run');
    });

    $("#btnHeroHit").click(function() {
        // noop
        var comp = testObject.getComponent('animator');
        comp && comp.setState('hit');
    });

    $("#btnHeroDead").click(function() {
        // noop
        var comp = testObject.getComponent('animator');
        comp && comp.setState('dead');
    });

});

+(function($) {
    $('.selectpicker').selectpicker();

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
      $('#projectTree').fancytree({
        source: {
          url: "data/project.json",
          complete: function() {

          }
        }
      });
      $('#hierarchyTree').fancytree({
        source: {
          url: "data/hierarchy.json",
          complete: function() {

          }
        },
      });

    });


    $(window).on('load', function() {
        $('#hierarchyView .panel-body[data-autoheight], #gameView').mCustomScrollbar({
            axis: 'yx',
            scrollInertia: 0,
            // theme: 'inset-3-dark',
            // theme: 'inset',
            theme: '3d',
            advanced: {
                autoExpandHorizontalScroll: true
            }
        });

        $('#propertiesContent').mCustomScrollbar({
            scrollInertia: 0,
            theme: '3d'
        });
    });
}(jQuery));
