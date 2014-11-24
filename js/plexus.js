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


    var ClassLoader = {
        id: (0 | (Math.random() * 998)),
        instanceId: (0 | (Math.random() * 998)),
        compileSuper: function(func, name, id) {
            var str = func.toString();
            var pstart = str.indexOf('('), pend = str.indexOf(')');
            var params = str.substring(pstart + 1, pend);
            params = params.trim();
            var bstart = str.indexOf('{'), bend = str.lastIndexOf('}');
            var str = str.substring(bstart + 1, bend);
            while (str.indexOf('this._super') != -1) {
                var sp = str.indexOf('this._super');
                var bp = str.indexOf('(', sp);
                var bbp = str.indexOf(')', bp);
                var superParams = str.substring(bp + 1, bbp);
                superParams = superParams.trim();
                var coma = superParams ? ',' : '';
                str = str.substring(0, sp) + 'ClassLoader[' + id + '].' + name + '.call(this' + coma + str.substring(bp + 1);
            }
            return Function(params, str);
        },
        newId: function() {
            return this.id++;
        },
        newInstanceId: function() {
            return this.instanceId++;
        }
    };
    ClassLoader.compileSuper.ClassLoader = ClassLoader;

    plx.Class = function() {
    };

    plx.Class.extend = function(props) {
        var _super = this.prototype;
        var prototype = Object.create(_super);
        var classId = ClassLoader.newId();
        ClassLoader[classId] = _super;
        var desc = { writable: true, enumerable: false, configurable: true };
        prototype.__instanceId = null;
        function Class() {
            this.__instanceId = ClassLoader.newInstanceId();
            if (this.ctor)
                this.ctor.apply(this, arguments);
        };
        Class.id = classId;
        desc.value = classId;
        Object.defineProperty(prototype, "__pid", desc);
        Class.prototype = prototype;
        desc.value = Class;
        Object.defineProperty(Class.prototype, 'constructor', desc);
        // ...
        // ...
        Class.extend = plx.Class.extend;
        Class.implement = function(prop) {
            for (var name in prop) {
                prototype[name] = prop[name];
            }
        };
        return Class;
    };

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

    var GameObject = plx.Class.extend({
        _components: {},
        ctor: function() {
            this._super();
            this._id = (+new Date()).toString(16) + (Math.random() * 1000000000 | 0).toString(16) + (++GameObject.sNumOfObjects);
        },
        getId: function() {
            return this._id;
        },
        getComponent: function(component) {
            var name = component;
            if (typeof component === 'function') {
                name = component.prototype.name;
            }

            return this._components[name];
        },
        addComponent: function(component) {
            if (!component || !component.name)
                return;

            this._components[component.name] = component;
            return this;
        },
        // Remove component data by removing the reference to it.
        removeComponent: function(component) {
            // Allows either a component function or a string of a component name to be passed in.
            var name = component;
            if (typeof component === 'function') {
                name = component.prototype.name;
            }

            // Remove component data by removing the reference to it.
            delete this._components[name];
            return this;
        },
        getTag: function() {
            return this._tag;
        },
        setTag: function(tagValue) {
            this._tag = tagValue;
        }
    });

    GameObject.sNumOfObjects = 0;

    //------------------------------
    // Plexus Component
    //------------------------------

    var GameComponent = plx.Class.extend({
        ctor: function() {
            this._owner = null;
        },
        getOwner: function() {
            return this._owner;
        },
        setOwner: function(owner) {
            this._owner = owner;
        }
    });

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
            // console.log(JSON.stringify(self._managed, null, 4));
            this._managed.every(function(elt, i) {
                if (typeof self.updateObjectDelta === 'function')
                    self.updateObjectDelta(elt, dt);
                return true;
            }, self);
        }
    });

    var _managedObjects = [];
    var _managedSystems = [];
    var System = plexus.class(function() {}, {
        ctor: function() {
            this._super();
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
            console.log("The comp is null? %s", comp ? "true" : "false");
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
    plx.GameComponent = GameComponent;
    plx.GameObject = GameObject;

})(plexus);

// vi: ft=javascript sw=4 ts=4 et :
