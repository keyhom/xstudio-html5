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

    var FuncRegexTest = /\b_super\b/;
    var releaseMode = false;
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
        for(var idx = 0, li = arguments.length; idx < li; ++idx) {
            var prop = arguments[idx];
            for (var name in prop) {
                var isFunc = (typeof prop[name] === 'function');
                var override = (typeof _super[name] === 'function');
                var hasSuperCall = FuncRegexTest.test(prop[name]);
                if (releaseMode && isFunc && override && hasSuperCall) {
                    desc.value = ClassLoader.compileSuper(prop[name], name, classId);
                    Object.defineProperty(prototype, name, desc);
                } else if(isFunc && override && hasSuperCall) {
                    desc.value = (function(name, fn) {
                        return function() {
                            var tmp = this._super;
                            this._super = _super[name];
                            var ret = fn.apply(this, arguments);
                            this._super = tmp;
                            return ret;
                        };
                    })(name, prop[name]);
                    Object.defineProperty(prototype, name, desc);
                } else if (isFunc) {
                    desc.value = prop[name];
                    Object.defineProperty(prototype, name, desc);
                } else {
                    prototype[name] = prop[name];
                }

                // ... Getters and Setters ... ?
            }
        }
        Class.extend = plx.Class.extend;
        Class.implement = function(prop) {
            for (var name in prop) {
                prototype[name] = prop[name];
            }
        };
        return Class;
    };

    //------------------------------
    // Plexus GameObject
    //------------------------------

    /**
     * @class GameObject
     */
    var GameObject = plx.Class.extend({
        _components: {},
        _data: null,
        ctor: function() {
            this._id = (+new Date()).toString(16) + (Math.random() * 1000000000 | 0).toString(16) + (++GameObject.sNumOfObjects);
        },
        getId: function() {
            return this._id;
        },
        getUserData: function() {
            return this._data;
        },
        setUserData: function(data) {
            // plx.extend(this._data, data);
            this._data = data;
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
            if (typeof component.setOwner === 'function')
                component.setOwner(this);

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
            component = this._components[name];
            delete this._components[name];
            if (typeof component.setOwner === 'function')
                component.setOwner(null);

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

    /**
     * @class GameComponent
     */
    var GameComponent = plx.Class.extend({
        _owner: null,
        ctor: function() {

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

    /**
     * @class System
     */
    var System = plexus.Class.extend({
        _managedObjects: [],
        _managedSystems: [],
        ctor: function() {

        },
        addSubSystem: function(sub) {
            if (sub && sub.name) {
                this._managedSystems[sub.name] = sub;
                this._managedSystems.push(sub);
            }
        },
        removeSubSystem: function(sub) {
            var name = sub;
            if (typeof sub === 'function') {
                name = sub.prototype.name;
            }
            var origin = this._managedSystems[name];
            delete this._managedSystems[name];
            var idx = this._managedSystems.indexOf(origin);
            if (idx != -1) {
                this._managedSystems.splice(idx, 1);
            }
            return origin;
        },
        addObject: function(obj) {
            this._managedObjects.push(obj);

            // added in subsystems.
            this._managedSystems.forEach(function(elt, i) {
                elt.order(obj);
                return true;
            });
        },
        removeObject: function(obj) {
            var index = this._managedObjects.indexOf(obj);
            if (index != -1) {
                this._managedObjects.splice(index, 1);

                // remove in subsystems.
                this._managedSystems.every(function(elt, i) {
                    elt.unorder(elt);
                    return true;
                });
            }
        },
        update: function(dt) {
            this._managedSystems.forEach(function(elt, i) {
                elt.update(dt);
                return true;
            });
        }
    });

    /**
     * @class SubSystem
     */
    var SubSystem = plexus.Class.extend({
        _managed: [],
        check: function(obj) {
            if (!this.name)
                return false;
            if (typeof obj.getComponent === 'function')
                return obj.getComponent(this.name);
            return false;
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
        },
        updateObjectDelta: function(obj, dt) {
            if (!this.name)
                return;

            var comp = obj.getComponent(this.name);
            comp && comp.update(dt);
        }
    });

    //------------------------------
    // SubSystems
    //------------------------------

    var InputSystem = SubSystem.extend({
        name: 'input',
        check: function(obj) {
            if (typeof obj.getComponent === 'function') {
                return obj.getComponent(this.name);
            }
            return false;
        }
    });

    /**
     * @class PhysicsSystem
     */
    var PhysicsSystem = SubSystem.extend({
        name: 'physics',
        check: function(obj) {
            if (typeof obj.getComponent=== 'function') {
                return obj.getComponent(this.name);
            }
            return false;
        },
        updateObjectDelta: function(obj, dt) {

        }
    });

    /**
     * @class AnimatorSystem
     */
    var AnimatorSystem = SubSystem.extend({
        name: 'animator',
        check: function(obj) {
            if (typeof obj.getComponent === 'function') {
                return obj.getComponent(this.name);
            }
            return false;
        },
        updateObjectDelta: function(obj, dt) {
            var comp = obj.getComponent(this.name);
            comp && comp.update(dt);
        }
    });

    var _systemInstance = undefined;
    System.getInstance = function getSystem() {
        if (!_systemInstance)
            _systemInstance = new System;
        return _systemInstance;
    };

    plx.GameSystem = System;
    plx.GameSubSystem = SubSystem;
    plx.InputSystem = InputSystem;
    plx.PhysicsSystem = PhysicsSystem;
    plx.AnimatorSystem = AnimatorSystem;

    plx.GameComponent = GameComponent;
    plx.GameObject = GameObject;

})(plexus);

// vi: ft=javascript sw=4 ts=4 et :
