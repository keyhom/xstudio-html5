// AnimatorSystem.

(function() {
    console.log("AnimatorSystem [loaded]");

    var Animator = plexus.AnimatorSystem.extend({
        ctor: function() {

        },
        updateObjectDelta: function(obj, dt) {
            var comp = obj.getComponent(this.name);
            if (comp) {
                comp.update(dt);
            }
        }
    });

    plexus.CocosAnimatorSystem = Animator;
}());

// vi: ft=javascript.javascript_tern ts=4 sw=4 et
