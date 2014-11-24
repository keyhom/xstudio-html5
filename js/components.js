// namespace plexus
var plexus = plexus || {};

console.log("components.js [loaded].");

// Plexus Components
plexus.components = plexus.components || {};
(function(plxc){

    /**
     * @class Transform
     */
    var TransformComponent = plexus.GameComponent.extend({
        name: "transform",
        ctor: function() {
            this._super();
            plexus.extend(this, {
                positionX: 0,
                positionY: 0,
                rotationX: 0,
                rotationY: 0,
                scaleX: 0,
                scaleY: 0
            });
            console.log("Transform's ctor call.");
        },
        update: function() {
            var owner = this.getOwner();
            if (!owner) return;

            owner.setPositionX(this.positionX);
            owner.setPositionY(this.positionY);
            owner.setRotationX(this.rotationX);
            owner.setRotationY(this.rotationY);
            owner.setScaleX(this.scaleX);
            owner.setScaleY(this.scaleY);
        }
    });

    /**
     * @class InputComponet
     */
    var InputComponent = plexus.GameComponent.extend({
        name: "input",
        ctor: function() {
            this._super();
        }
    });

    /**
     * @class PhysicsComponent
     */
    var PhysicsComponent = plexus.GameComponent.extend({
        name: "physics",
        ctor: function() {
            this._super();
        },
        update: function(dt) {
            console.log("Update in physics.");
        }
    });

    var Animator = plexus.GameComponent.extend({
        name: "animator",
        ctor: function() {
            this._super();
        },
        update: function(dt) {
            // console.log("Animator delta.");
            // console.log("Owner: %s", JSON.stringify(this.getOwner()));
        }
    });

    plxc.Transform = TransformComponent;
    plxc.Input = InputComponent;
    plxc.Physics = PhysicsComponent;
    plxc.Animator = Animator;

})(plexus.components);

// vi: ft=javascript sw=4 ts=4 et :
