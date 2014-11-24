var PlayerInputSystem = plexus.InputSystem.extend({
    _runningScene: null,
    attachEventListener: function() {
        if (this._runningScene) {
            var l = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function(touch, event) {
                    var loc = touch.getLocation();
                    var locDelta = touch.getDelta();
                    return true;
                }
            });

            cc.eventManager.addListener(l, 1);
        }
    },
    detachEventListener: function() {
        if (this._runningScene) {

        }
    },
    updateObjectDelta: function(obj, dt) {
        // console.log('yes');
        if (!this._runningScene && cc.director) {
            this._runningScene = cc.director.getRunningScene();
            this.attachEventListener();
        }

        if (!this._runningScene) return;
    }
});
// vi: ft=javascript.javascript_tern ts=4 sw=4 et

