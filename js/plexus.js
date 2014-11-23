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

        var Class = function() {
            this._super = superType.prototype.ctor || function() {};
            if (typeof this.ctor === 'function') {
                if (arguments.length > 0) {
                    this.ctor.apply(this, arguments);
                } else {
                    this.ctor();
                }
            }
            this._super = undefined;

            return this;
        };

        plx.extend(Class.prototype, superType.prototype, declares);
        return Class;
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

    //------------------------------
    // Plexus System
    //------------------------------

    function _addSubSystem(sub) {
        _managedSystems.push(sub);
    }

    function _removeSubSystem(sub) {
        var index = _managedSystems.indexOf(sub);
        if (index != -1) {
            _managedSystems.splice(index, 1);
        }
    }

    var SubSystem = plexus.class(function() {}, {
        _managed: [],
        check: function(obj) {
            return true;
        },
        order: function(obj) {
            if (this.check(obj)) {
                this._managed.push(obj);
            }
        },
        unorder: function(obj) {
            var index = -1;
            if ((index = _managed.indexOf(obj)) != -1) {
                if (this.check(obj)) {
                    this._managed.splice(index, 1);
                }
            }
        },
        update: function(dt) {
            var self = this;
            this._managed.forEach(function(elt, i) {
                self.updateObjectDelta(elt, dt);
                return true;
            });
        },
        updateObjectDelta: function(obj, delta) {

        }
    });

    var _managedObjects = [];
    var _managedSystems = [];
    var System = plexus.class(function() {}, {
        ctor: function() {

        },
        addObject: function(obj) {
            _managedObjects.push(obj);

            // added in subsystems.
            _managedSystems.every(function(elt, i) {
                elt.order(obj);
                return true;
            });
        },
        removeObject: function(obj) {
            var index = _managedObjects.indexOf(obj);
            if (index != -1) {
                _managedObjects.splice(index, 1);

                // remove in subsystems.
                _managedSystems.every(function(elt, i) {
                    elt.unorder(elt);
                    return true;
                });
            }
        },
        update: function(dt) {
            _managedSystems.forEach(function(elt, i) {
                elt.update(dt);
                return true;
            });
        }
    });

    // subsystems.
    var PhysicsSystem = plx.extend(SubSystem, {
        check: function(obj) {
            if (typeof obj.getComponet === 'function') {
                return obj.getComponet("physics");
            }
            return false;
        },
        updateObjectDelta: function(obj, dt) {

        }
    });

    var AnimatorSystem = plx.extend(SubSystem, {
        check: function(obj) {
            if (typeof obj.getComponet === 'function') {
                return obj.getComponet("animator");
            }
            return false;
        },
        updateObjectDelta: function(obj, dt) {
            var comp = obj.getCompoennt('animator');
            if (comp) {
                console.log("updateObjectDelta: %s", comp);
            }
        }
    });

    var _systemInstance = undefined;
    System.getInstance = function() {
        if (!_systemInstance)
            _systemInstance = new System;
        return _systemInstance;
    };

    _managedSystems.push(new PhysicsSystem());
    _managedSystems.push(new AnimatorSystem());
    plx.GameSystem = System;

})(plexus);

// vi: ft=javascript sw=4 ts=4 et :
