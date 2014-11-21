// namespace plexus
var plexus = plexus || {};

console.log("components.js [loaded].");

// Plexus Components
plexus.components = plexus.components || {};
(function(plxc){

    /**
     * @interface Transform
     */
    function Transform(initData) {
        var defaults = {
            positionX: 0,
            positionY: 0,
            rotationX: 0,
            rotationY: 0,
            scaleX:    0,
            scaleY:    0
        };

        initData = initData || defaults;

        plexus.extend(this, initData);

        return this;
    };

    var Transform = plexus.class(plexus.GameComponent, {
        ctor: function() {
            plexus.extend(this, {
                positionX: 0,
                positionY: 0,
                rotationX: 0,
                rotationY: 0,
                scaleX: 0,
                scaleY: 0
            });
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

    console.log(typeof Transform);

})(plexus.components);

// vi: ft=javascript sw=4 ts=4 et :
