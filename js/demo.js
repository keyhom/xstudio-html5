(function(){

    var GameScene = cc.Layer.extend({
        init: function() {
            if (!this._super()) return false;
            // initialize.


            return true;
        },
        onEnter: function() {
            this._super();

        }
    });

    GameScene.createScene = function() {
        var scene = cc.Scene.create();
        var layer = new GameScene();
        if (layer && layer.init()) {
            scene.addChild(layer);
            return scene;
        }
        return null;
    };

    cc.loader.resPath = './res';
    cc.game.onStart = function() {

        // load resources
        cc._loaderImage = cc.loader.resPath + "/level_1/loading_bg.jpg";
        cc.LoaderScene.preload([
            "HelloWorld.png",
            "level_1/background.jpg",
            "level_1/loading_bg.jpg",
            "level_1/huayao.png"
        ], function() {
            cc.director.runScene(GameScene.createScene());
        }, this);
    };

    // Make the canvas fit the browser window's size.
    $('#gameCanvas')
        .attr('width', $(document.body).width())
        .attr('height', $(document).height()).show();

    // Run game.
    cc.game.run("gameCanvas");

})();

// vi:ft=javascript ts=4 sw=4 et
