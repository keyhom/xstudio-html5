// namespace plexus

var plexus = plexus || {};
window._plexus = plexus;

(function(plx) {

    console.log("plexus.js [loaded]");

    //------------------------------
    // Plexus utilties functions
    //------------------------------

    plx.each = function(obj, iterator, context) {
        if (!obj) return;
        if (obj instanceof Array) {
            for (var i = 0, li = obj.length; i <li; i++) {
                if (iterator.call(context, obj[i], i) === false) return;
            }
        } else {
            for (var key in obj) {
                if (iterator.call(context, obj[key], key) === false) return;
            }
        }
    };

    plx.extend = function(target) {
        var sources = arguments.length >= 2 ? Array.prototype.slice.call(arguments, 1) : [];
        plx.each(sources, function(src) {
            for (var key in src) {
                if (src.hasOwnProperty(key))
                    target[key] = src[key];
            }
        });
        return target;
    };

    plx._classes = {};

    /**
     * Defined and return a class
     */
    plx.class = function(superType, declares) {
        if (typeof superType !== 'function') {
            return undefined;
        }

        return plx.extend({}, superType.prototype, declares);
    };

    //------------------------------
    // Plexus GameObject
    //------------------------------

    // @class plexus.GameObject
    plx.GameObject = function Entity() {
        var self = this;
        var _super = plx.GameObject.prototype;

        // Generate a pseudo random ID.
        this.id = (+new Date()).toString(16) + (Math.random() * 1000000000 | 0).toString(16)
            + _super.sNumOfObjects;

        ++_super.sNumOfObjects;

        // The component data will live in this object.
        this.mComponents = {};

        // Private member.
        var private = {
            mTag: "Untagged",
            mLayer: "Default"
        };

        plx.extend(this, {
            getTag: function() {
                return private.mTag;
            },
            setTag: function(tagValue) {
                private.mTag = tagValue;
            }
        });

        return this;
    };

    // Keep track of GameObjects created.
    plx.GameObject.prototype.sNumOfObjects = 0;

    // Add component data to the GameObject.
    plx.GameObject.prototype.addComponent = function(component) {
        if (!component || !component.name)
            return;

        this.mComponents[component.name] = component;
        return this;
    };

    // Remove component data by removing the reference to it.
    plx.GameObject.prototype.removeComponent = function(component) {
        // Allows either a component function or a string of a component name to be passed in.
        var name = component;
        if (typeof component === 'function') {
            name = component.prototype.name;
        }

        // Remove component data by removing the reference to it.
        delete this.mComponents[name];
        return this;
    };

    //------------------------------
    // Plexus Component
    //------------------------------

    plx.GameComponent = function() {
        var self = this;
        self._owner = null; // References owner to null.
        return self;
    };

    plx.GameComponent.prototype.getOwner = function() {
        return this._owner;
    };

    plx.GameComponent.prototype.setOwner = function(owner) {
        this._owner = owner;
    };

})(plexus);

// vi: ft=javascript sw=4 ts=4 et :
