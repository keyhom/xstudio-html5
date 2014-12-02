// Main.js

console.log("Main.js [loaded]");

(function() {
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

(function() {
    function resizeWorkbench() {
        var workbench = $('#workbench');
        var workbenchContent = workbench.find('#workbenchContent');

        if (workbench && workbenchContent) {
            var h = workbench.height();
            var offset = workbenchContent.offset().top - workbench.offset().top;
            if (h) {
                workbenchContent.height(h - offset);
            }
        }
    }

    $('.selectpicker').selectpicker();
    $(document).ready(function() {
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
}())
// vi: ft=javascript ts=4 sw=4 et :

