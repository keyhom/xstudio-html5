var plexus = plexus || {};

(function(plx) {
    console.log("components.js [loaded].");

    plexus.each = function (obj, iterator, context) {
        if (!obj)
            return;
        if (obj instanceof Array) {
            for (var i = 0, li = obj.length; i < li; i++) {
                if (iterator.call(context, obj[i], i) === false)
                    return;
            }
        } else {
            for (var key in obj) {
                if (iterator.call(context, obj[key], key) === false)
                    return;
            }
        }
    };

    plx.extend = function(target) {
        var sources = arguments.length >= 2 ? Array.prototype.slice.call(arguments, 1) : [];
        cc.each(sources, function(src) {
            for(var key in src) {
                if (src.hasOwnProperty(key)) {
                    target[key] = src[key];
                }
            }
        });
        return target;
    };

    // Base ECS's type.
    plx.GameEntity = function Entity() {
        var self = this;
        var _super = plx.GameEntity.prototype;
        // Generate a pseudo random ID.
        this.id = (+new Date()).toString(16) + (Math.random() * 1000000000 | 0).toString(16) + _super._count;

        // increment counter
        _super._count++;

        // The component data will live in this object.
        this.components = {};

        return this;
    };

    // keep track of entities created.
    plx.GameEntity.prototype._count = 0;

    plx.extend(plx.GameEntity.prototype, {
        // Add component data to the entity
        addComponent: function addComponent(component) {
            // NOTICE: the component must have a name property (which is defined as a prototype of a component function)
            this.components[component.name] = component;
            return this;
        },
        // Remove component data by removing the reference to it.
        removeComponent: function removeComponent(component) {
            // Allows either a component function or a string of a component name to be passed in.
            var name = component;
            if (typeof component === 'function') {
                name = component.prototype.name;
            }
            // Remove component data by removing the reference to it.
            delete this.components[name];
            return this;
        },
        // Function to print / log information about the entity
        print: function print() {
            console.log(JSON.stringify(this, null, 4));
            return this;
        }
    });

    plx.GameComponent = {};
    plx.GameSystem = {};

}(plexus))

// Plexus Components
plexus.components = plexus.components || {};
(function(plxc){

    plxc.Health = function ComponentHealth(value) {
        value = value || 20;
        this.value = value;
        return this;
    };
    plxc.Health.prototype.name = "health";

    plxc.Transform = function CompoenntTransform(params) {
        params = params || {
            position: {},
            rotation: {},
            scale: {}
        };

        var pos = params.position;
        this.x = pos.x || 0;
        this.y = pos.y || 0;
        this.z = pos.z || 0;

        var rot = params.rotation;
        this.rotationX = rot.x || 0;
        this.rotationY = rot.y || 0;
        this.rotationZ = rot.z || 0;

        var scale = params.scale;
        this.scaleX = scale.x || 1;
        this.scaleY = scale.y || 1;
        this.scaleZ = scale.z || 1;

        return this;
    }
    plxc.Transform.prototype.name = "transform";

})(plexus.components);

// vi: ft=javascript sw=4 ts=4 et :
