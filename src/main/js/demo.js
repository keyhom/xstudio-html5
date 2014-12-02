(function(){
    console.log("plugins.js [loaded].");

    var hero = null;

    var GameScene = cc.Layer.extend({
        _bg: null,
        _objectSprite: null,
        _hero: null,
        init: function() {
            if (!this._super()) return false;
            // initialize.
            _bg = cc.Sprite.create("level_1/background.jpg");
            _bg.setAnchorPoint(0, 0);
            _bg.setPosition(0, 0);
            this.addChild(_bg, 0);

            _objectSprite = cc.Node.create();
            _objectSprite.setAnchorPoint(0, 0);
            _objectSprite.setPosition(0, 0);
            this.addChild(_objectSprite, 0);

            this.scheduleUpdate();
            this.addComponent(null);

            return true;
        },
        onEnter: function() {
            this._super();

            hero = cc.Sprite.create();
            hero.setPosition(1056, 317);
            _objectSprite.addChild(hero, 0);

            hero.runAction(cc.RepeatForever.create(cc.Animate.create(cc.animationCache.getAnimation("huayao_idle"))));

            _bg.runAction(cc.Follow.create(hero, cc.rect(0, 0, _bg.getContentSize().width, _bg.getContentSize().height)));

            // var l = cc.EventListener.create({
                // event: cc.EventListener.TOUCH_ONE_BY_ONE,
                // swallowTouches: true,
                // onTouchBegan: function(touch, event) {
                    // // do something.
                    // var loc = touch.getLocation();
                    // loc = _bg.convertToNodeSpace(loc);
                    // hero.runAction(cc.MoveTo.create(1, loc));

                    // return true;
                // }
            // });

            // cc.eventManager.addListener(l, this);

            this._hero = hero;

            $(document.body).trigger("GameLoaded", { object: hero });
        },
        onExit: function() {
            this._super();
        },
        update: function(dt) {
            if (_objectSprite && _bg) {
                _objectSprite.setPosition(_bg.getPosition());
            }
        },
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

    var SceneViewContainerStg = cc.ContainerStrategy.extend({
        preApply: function(view) {

        },
        apply: function(view, designedResolution) {
            this._setupContainer(view, view.getFrameSize().width, view.getFrameSize().height);
        },
        postApply: function(view) {

        }
    });

    var SceneViewContentStg = cc.ContentStrategy.extend({
        preApply: function(view) {
        },
        apply: function(view, designedResolution) {
            // var containerW = cc.canvas.width, containerH = cc.canvas.height;
            var containerW = view.getFrameSize().width, containerH = view.getFrameSize().height;
            // var contentW = designedResolution.width, contentH = designedResolution.height;
            var contentW = containerW, contentH = containerH;
            var scaleX = 1, scaleY = 1;
            return this._buildResult(containerW, containerH, contentW, contentH, scaleX, scaleY);
            // return this._buildResult(720, 480, 720, 480, scaleX, scaleY);
        },
        postApply: function(view) {
        }
    });

    cc.loader.resPath = './res';

    $(window).on('load', function() {
        var __gameRunning = false;
        cc.game.onStart = function() {
            // load resources
            cc._loaderImage = cc.loader.resPath + "/level_1/loading_bg.jpg";
            cc.LoaderScene.preload([
                "HelloWorld.png",
                "level_1/background.jpg",
                "level_1/loading_bg.jpg",
                "level_1/huayao.png",
                "level_1/huayao.plist",
                "level_1/animations.plist"
            ], function(err) {
                // assert(!err);

                var t1 = cc.textureCache.getTextureForKey("level_1/huayao.png");
                if (t1) {
                    cc.spriteFrameCache.addSpriteFrames("level_1/huayao.plist", t1);
                }

                cc.animationCache.addAnimations("level_1/animations.plist");
                // cc.director._openGLView.setDesignResolutionSize(720, 480, 2);
                // var policy = new cc.ResolutionPolicy(cc.ContainerStrategy.PROPORTION_TO_FRAME, cc.ContentStrategy.EXACT_FIT);
                var policy = new cc.ResolutionPolicy(new SceneViewContainerStg(), new SceneViewContentStg());
                cc.view.setDesignResolutionSize(720, 480, policy);
                cc.view.resizeWithBrowserSize(true);

                cc.director.setDisplayStats(true);
                cc.director.runScene(GameScene.createScene());
                cc.director.getScheduler().scheduleUpdateForTarget(plexus.GameSystem.getInstance(), cc.Scheduler.PRIORITY_SYSTEM, false);

                __gameRunning = true;

            }, this);
        };

        var gameParent = $('#gameCanvas').parent();

        // Make the canvas fit the browser window's size.
        // $('#gameCanvas')
            // .attr('width', $(document.body).width())
            // .attr('height', $(document).height()).show();


        // Run game.
        cc.game.run("gameCanvas");
        setInterval(function() {
            if (__gameRunning) {
                var gameView = $('#sceneView');
                var fs = cc.view.getFrameSize();
                if (fs) {
                    if (fs.width != gameView.width() || fs.height != gameView.height()) {
                        cc.view.setFrameSize(gameView.width(), gameView.height());
                        cc.view.setDesignResolutionSize(gameView.width(), gameView.height());
                    }
                }
            }
        }, 1000);
    });

})();

// vi:ft=javascript ts=4 sw=4 et
