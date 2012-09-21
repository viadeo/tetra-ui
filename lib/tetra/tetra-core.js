// ------------------------------------------------------------------------------
// Tetra.js
// Javascript MVC framework to build asynchronous webapp on client and server
//
// Author: Olivier Hory
// Contributors: Cormac Flynn, Yannick Croissant, Sylvain Faucherand
// ------------------------------------------------------------------------------
// Copyright (c) Viadeo/APVO Corp., Olivier Hory and other Tetra contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// ------------------------------------------------------------------------------

// Tetra namespace
// ------------------------------------------------------------------------------
var tns = {};

// Tetra structure
// ------------------------------------------------------------------------------
var tetra = (function() {
	
	// Settings:
	// - default environnement
	// - scripts and ajax calls default locations
	// ----------------------------------------
	var _conf = {
		env: 'jQuery',
		enableBootstrap: false,
		
		APPS_PATH : '/javascript/tetramvc/apps',
		GLOBAL_PATH : '/javascript/tetramvc',
		COMP_PATH : '/resource/comp',
		FETCH_URL : '/javascript/tetramvc/model/{name}/fetch.json',
		FETCH_METHOD : 'GET',
		SAVE_URL : '/javascript/tetramvc/model/{name}/save.json',
		SAVE_METHOD : 'POST',
		DEL_URL : '/javascript/tetramvc/model/{name}/delete.json',
		DEL_METHOD : 'DELETE',
		RESET_URL : '/javascript/tetramvc/model/{name}/reset.json',
		RESET_METHOD : 'PUT'
	};
	
	// Core modules of current instance
	// ----------------------------------------
	
	// Extendable objects
	var
		_, // "_" abstracted library
		_started = false,
		_tmp = {}, // all modules awaiting to be started
		_core = {}, // public modules
		_mod = {}, // internal modules
		_notImplem = function(mod, fct) {
			if(fct) {
				_mod.debug.log('module ' + mod + ' : function ' + fct + ' not implemented', 'all', 'error');
			} else {
				_mod.debug.log('module ' + mod + ' not implemented', 'all', 'error');
			}
		}
	;
	
	_mod.lib = _ = (typeof $ !== 'undefined') ? $ : null;
	_mod.dep = { // dependencies loader
		define: function() { _notImplem('dep', 'define'); },
		undef: function() { _notImplem('dep', 'undef'); },
		require: function() { _notImplem('dep', 'require'); }
	};
	_mod.orm = function() { // orm + ajax requester
		_notImplem('orm');
		return {
			type: 'interface',
			save: function() { _notImplem('orm', 'save'); },
			fetch: function() { _notImplem('orm', 'fetch'); },
			del: function() { _notImplem('orm', 'del'); },
			reset: function() { _notImplem('orm', 'reset'); },
			notify: function() { _notImplem('orm', 'notify'); }
		};
	};
	
	
	// PIPES for notifications
	// --------------------
	_mod.pipe = {
		page: {
			notify: function(message, data) {
				_mod.debug.log('page : ' + message, 'all', 'log', data);
				tetra.controller.notify(message, data);
				return this;
			}
		},
	
		appBuilder: function(target, scope) {
			if(target === 'view') {
				return {
					notify: function(message, data) {
						_mod.debug.log('app ' + scope + ' : ' + target + ' : ' + message, scope, 'log', data);
						tetra.view.notify(message, data, scope);
						return this;
					}
				};
			} else {
				return {
					notify: function(message, data) {
						_mod.debug.log('app ' + scope + ' : ' + target + ' : ' + message, scope, 'log', data);
						tetra.controller.notify(message, data, scope);
						return this;
					},
					exec: function() { // actionName, ctrlName (optional), data, cbk
						var
							args = [],
							i = 0,
							len = arguments.length
						;
						for(; i < len; i++) {
							args.push(arguments[i]);
						}
						args.push(scope);
						return tetra.controller.exec.apply(this, args);
					}
				};
			}
		}
	};
	
	
	// MVC interface
	// Implemented by native modules view, controller and model
	// --------------------
	_core.view = {
		register: function() { _notImplem('view', 'register'); },
		destroy: function() { _notImplem('view', 'destroy'); },
		notify: function() { _notImplem('view', 'notify'); },
		debug: {}
	};
	
	_core.controller = {
		register: function() { _notImplem('controller', 'register'); },
		destroy: function() { _notImplem('controller', 'destroy'); },
		notify: function() { _notImplem('controller', 'notify'); },
		modelNotify: function() { _notImplem('controller', 'modelNotify'); },
		exec: function() { _notImplem('controller', 'exec'); },
		debug: {}
	};
	
	_core.model = {
		register: function() { _notImplem('model', 'register'); },
		destroy: function() { _notImplem('model', 'destroy'); },
		debug: {}
	};
	
	
	// Logger + debugger
	// --------------------
	_core.debug = (function(){
		var
			_debugApp = {},
			debugLog = function(msg, scope, type, data) {
				scope = scope || 'all';
				if(typeof window.console !== 'undefined' && (_debugApp[scope] || (scope !== 'all' && _debugApp.all))){
					data = data || '';
					type = type || 'log';
					try {
						console[type](msg, data);
					} catch(e){}
				}
			}
		;
		
		_mod.debug = {
			log: function() {}
		};
		
		return {
			enable: function(scope) {
				scope = scope || 'all';
				_debugApp[scope] = true;
				
				// Allow access to underscore lib outside of tetra apps
				window._ = _;
				
				// Initialize internal and external debug objects
				_mod.debug = {
					log : debugLog
				};
				_core.debug = {
					enable : this.enable,
						
					man : function() {
						debugLog('Tetra.js ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
						debugLog('> debug enabled');
						debugLog('> man specs > tetra.debug.man()');
						debugLog('	# View specs			> tetra.debug.view.man()');
						debugLog('	# Controller specs		> tetra.debug.controller.man()');
						debugLog('	# Model specs			> tetra.debug.model.man()');
						debugLog('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
						
						return true;
					},
					
					view: _core.view.debug,
					
					ctrl : _core.controller.debug,
					
					model: _core.model.debug
				};
			}
		};
	})();
	
	// Extend core functionality with new modules
	// --------------------
	_core.extend = (function() {
		
		var
			_add = function(name, module) {
				if(name === 'conf') {
					for(var attr in module) {
						_conf[attr] = module[attr];
					}
				} else {
					if(_started) {
						_addModule(name, module);
					} else {
						_tmp[name] = module;
						_mod.debug.log('Module "'+ name +'" defined');
					}
				}
			},
			
			_addModule = function(name, module) {
				if(typeof _core[name] !== 'undefined') {
					_core[name] = module(_conf, _mod, _);
					_mod.debug.log('Tetra module "'+ name +'" loaded');
				} else {
					if(name === 'lib') {
						_mod[name] = _ = module(_conf, _mod, _);
					} else {
						_mod[name] = module(_conf, _mod, _);
					}
					_mod.debug.log('Extension module "'+ name +'" loaded');
				}
			},
			
			_extend = function() {
				if(typeof arguments[0] !== 'undefined') {
					if(typeof arguments[0] === 'string') {
						_add(arguments[0], arguments[1]);
					} else {
						for(var name in arguments[0]) {
							_add(name, arguments[0][name]);
						}
					}
				}
				
				return _core;
			},
			
			_start = function() {
				_started = true;
				
				// start all module in the temporary stack
				for(var name in _tmp) {
					_addModule(name, _tmp[name]);
				}
				
				// empty the temporary module stack
				_tmp = [];
			}
		;
		
		// Start the core when all dependencies and conf are set
		// --------------------
		_core.start = _start;
		
		return _extend;
	})();
	
	
	// Initialization of core
	// --------------------
	
	// Public functions
	return _core;
	
})();

if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	exports = module.exports = {};
	exports.tns = tns;
	exports.tetra = tetra;
}

/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.0.6 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
//Not using strict: uneven strict support in browsers, #392, and causes
//problems with requirejs.exec()/transpiler plugins that may not be strict.
/*jslint regexp: true, nomen: true, sloppy: true */
/*global window, navigator, document, importScripts, jQuery, setTimeout, opera */

var requirejs, require, define;
(function (global) {
    var req, s, head, baseElement, dataMain, src,
        interactiveScript, currentlyAddingScript, mainScript, subPath,
        version = '2.0.6',
        commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
        cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
        jsSuffixRegExp = /\.js$/,
        currDirRegExp = /^\.\//,
        op = Object.prototype,
        ostring = op.toString,
        hasOwn = op.hasOwnProperty,
        ap = Array.prototype,
        aps = ap.slice,
        apsp = ap.splice,
        isBrowser = !!(typeof window !== 'undefined' && navigator && document),
        isWebWorker = !isBrowser && typeof importScripts !== 'undefined',
        //PS3 indicates loaded and complete, but need to wait for complete
        //specifically. Sequence is 'loading', 'loaded', execution,
        // then 'complete'. The UA check is unfortunate, but not sure how
        //to feature test w/o causing perf issues.
        readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
                      /^complete$/ : /^(complete|loaded)$/,
        defContextName = '_',
        //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
        isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
        contexts = {},
        cfg = {},
        globalDefQueue = [],
        useInteractive = false;

    function isFunction(it) {
        return ostring.call(it) === '[object Function]';
    }

    function isArray(it) {
        return ostring.call(it) === '[object Array]';
    }

    /**
     * Helper function for iterating over an array. If the func returns
     * a true value, it will break out of the loop.
     */
    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    /**
     * Helper function for iterating over an array backwards. If the func
     * returns a true value, it will break out of the loop.
     */
    function eachReverse(ary, func) {
        if (ary) {
            var i;
            for (i = ary.length - 1; i > -1; i -= 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Cycles over properties in an object and calls a function for each
     * property value. If the function returns a truthy value, then the
     * iteration is stopped.
     */
    function eachProp(obj, func) {
        var prop;
        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (func(obj[prop], prop)) {
                    break;
                }
            }
        }
    }

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     * This is not robust in IE for transferring methods that match
     * Object.prototype names, but the uses of mixin here seem unlikely to
     * trigger a problem related to that.
     */
    function mixin(target, source, force, deepStringMixin) {
        if (source) {
            eachProp(source, function (value, prop) {
                if (force || !hasProp(target, prop)) {
                    if (deepStringMixin && typeof value !== 'string') {
                        if (!target[prop]) {
                            target[prop] = {};
                        }
                        mixin(target[prop], value, force, deepStringMixin);
                    } else {
                        target[prop] = value;
                    }
                }
            });
        }
        return target;
    }

    //Similar to Function.prototype.bind, but the 'this' object is specified
    //first, since it is easier to read/figure out what 'this' will be.
    function bind(obj, fn) {
        return function () {
            return fn.apply(obj, arguments);
        };
    }

    function scripts() {
        return document.getElementsByTagName('script');
    }

    //Allow getting a global that expressed in
    //dot notation, like 'a.b.c'.
    function getGlobal(value) {
        if (!value) {
            return value;
        }
        var g = global;
        each(value.split('.'), function (part) {
            g = g[part];
        });
        return g;
    }

    function makeContextModuleFunc(func, relMap, enableBuildCallback) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0), lastArg;
            if (enableBuildCallback &&
                    isFunction((lastArg = args[args.length - 1]))) {
                lastArg.__requireJsBuild = true;
            }
            args.push(relMap);
            return func.apply(null, args);
        };
    }

    function addRequireMethods(req, context, relMap) {
        each([
            ['toUrl'],
            ['undef'],
            ['defined', 'requireDefined'],
            ['specified', 'requireSpecified']
        ], function (item) {
            var prop = item[1] || item[0];
            req[item[0]] = context ? makeContextModuleFunc(context[prop], relMap) :
                    //If no context, then use default context. Reference from
                    //contexts instead of early binding to default context, so
                    //that during builds, the latest instance of the default
                    //context with its config gets used.
                    function () {
                        var ctx = contexts[defContextName];
                        return ctx[prop].apply(ctx, arguments);
                    };
        });
    }

    /**
     * Constructs an error with a pointer to an URL with more information.
     * @param {String} id the error ID that maps to an ID on a web page.
     * @param {String} message human readable error.
     * @param {Error} [err] the original error, if there is one.
     *
     * @returns {Error}
     */
    function makeError(id, msg, err, requireModules) {
        var e = new Error(msg + '\nhttp://requirejs.org/docs/errors.html#' + id);
        e.requireType = id;
        e.requireModules = requireModules;
        if (err) {
            e.originalError = err;
        }
        return e;
    }

    if (typeof define !== 'undefined') {
        //If a define is already in play via another AMD loader,
        //do not overwrite.
        return;
    }

    if (typeof requirejs !== 'undefined') {
        if (isFunction(requirejs)) {
            //Do not overwrite and existing requirejs instance.
            return;
        }
        cfg = requirejs;
        requirejs = undefined;
    }

    //Allow for a require config object
    if (typeof require !== 'undefined' && !isFunction(require)) {
        //assume it is a config object.
        cfg = require;
        require = undefined;
    }

    function newContext(contextName) {
        var inCheckLoaded, Module, context, handlers,
            checkLoadedTimeoutId,
            config = {
                waitSeconds: 7,
                baseUrl: './',
                paths: {},
                pkgs: {},
                shim: {}
            },
            registry = {},
            undefEvents = {},
            defQueue = [],
            defined = {},
            urlFetched = {},
            requireCounter = 1,
            unnormalizedCounter = 1,
            //Used to track the order in which modules
            //should be executed, by the order they
            //load. Important for consistent cycle resolution
            //behavior.
            waitAry = [];

        /**
         * Trims the . and .. from an array of path segments.
         * It will keep a leading path segment if a .. will become
         * the first path segment, to help with module name lookups,
         * which act like paths, but can be remapped. But the end result,
         * all paths that use this function should look normalized.
         * NOTE: this method MODIFIES the input array.
         * @param {Array} ary the array of path segments.
         */
        function trimDots(ary) {
            var i, part;
            for (i = 0; ary[i]; i += 1) {
                part = ary[i];
                if (part === '.') {
                    ary.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                        //End of the line. Keep at least one non-dot
                        //path segment at the front so it can be mapped
                        //correctly to disk. Otherwise, there is likely
                        //no path mapping for a path starting with '..'.
                        //This can still fail, but catches the most reasonable
                        //uses of ..
                        break;
                    } else if (i > 0) {
                        ary.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
        }

        /**
         * Given a relative module name, like ./something, normalize it to
         * a real name that can be mapped to a path.
         * @param {String} name the relative name
         * @param {String} baseName a real name that the name arg is relative
         * to.
         * @param {Boolean} applyMap apply the map config to the value. Should
         * only be done if this normalization is for a dependency ID.
         * @returns {String} normalized name
         */
        function normalize(name, baseName, applyMap) {
            var pkgName, pkgConfig, mapValue, nameParts, i, j, nameSegment,
                foundMap, foundI, foundStarMap, starI,
                baseParts = baseName && baseName.split('/'),
                normalizedBaseParts = baseParts,
                map = config.map,
                starMap = map && map['*'];

            //Adjust any relative paths.
            if (name && name.charAt(0) === '.') {
                //If have a base name, try to normalize against it,
                //otherwise, assume it is a top-level require that will
                //be relative to baseUrl in the end.
                if (baseName) {
                    if (config.pkgs[baseName]) {
                        //If the baseName is a package name, then just treat it as one
                        //name to concat the name with.
                        normalizedBaseParts = baseParts = [baseName];
                    } else {
                        //Convert baseName to array, and lop off the last part,
                        //so that . matches that 'directory' and not name of the baseName's
                        //module. For instance, baseName of 'one/two/three', maps to
                        //'one/two/three.js', but we want the directory, 'one/two' for
                        //this normalization.
                        normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                    }

                    name = normalizedBaseParts.concat(name.split('/'));
                    trimDots(name);

                    //Some use of packages may use a . path to reference the
                    //'main' module name, so normalize for that.
                    pkgConfig = config.pkgs[(pkgName = name[0])];
                    name = name.join('/');
                    if (pkgConfig && name === pkgName + '/' + pkgConfig.main) {
                        name = pkgName;
                    }
                } else if (name.indexOf('./') === 0) {
                    // No baseName, so this is ID is resolved relative
                    // to baseUrl, pull off the leading dot.
                    name = name.substring(2);
                }
            }

            //Apply map config if available.
            if (applyMap && (baseParts || starMap) && map) {
                nameParts = name.split('/');

                for (i = nameParts.length; i > 0; i -= 1) {
                    nameSegment = nameParts.slice(0, i).join('/');

                    if (baseParts) {
                        //Find the longest baseName segment match in the config.
                        //So, do joins on the biggest to smallest lengths of baseParts.
                        for (j = baseParts.length; j > 0; j -= 1) {
                            mapValue = map[baseParts.slice(0, j).join('/')];

                            //baseName segment has config, find if it has one for
                            //this name.
                            if (mapValue) {
                                mapValue = mapValue[nameSegment];
                                if (mapValue) {
                                    //Match, update name to the new value.
                                    foundMap = mapValue;
                                    foundI = i;
                                    break;
                                }
                            }
                        }
                    }

                    if (foundMap) {
                        break;
                    }

                    //Check for a star map match, but just hold on to it,
                    //if there is a shorter segment match later in a matching
                    //config, then favor over this star map.
                    if (!foundStarMap && starMap && starMap[nameSegment]) {
                        foundStarMap = starMap[nameSegment];
                        starI = i;
                    }
                }

                if (!foundMap && foundStarMap) {
                    foundMap = foundStarMap;
                    foundI = starI;
                }

                if (foundMap) {
                    nameParts.splice(0, foundI, foundMap);
                    name = nameParts.join('/');
                }
            }

            return name;
        }

        function removeScript(name) {
            if (isBrowser) {
                each(scripts(), function (scriptNode) {
                    if (scriptNode.getAttribute('data-requiremodule') === name &&
                            scriptNode.getAttribute('data-requirecontext') === context.contextName) {
                        scriptNode.parentNode.removeChild(scriptNode);
                        return true;
                    }
                });
            }
        }

        function hasPathFallback(id) {
            var pathConfig = config.paths[id];
            if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
                removeScript(id);
                //Pop off the first array value, since it failed, and
                //retry
                pathConfig.shift();
                context.undef(id);
                context.require([id]);
                return true;
            }
        }

        /**
         * Creates a module mapping that includes plugin prefix, module
         * name, and path. If parentModuleMap is provided it will
         * also normalize the name via require.normalize()
         *
         * @param {String} name the module name
         * @param {String} [parentModuleMap] parent module map
         * for the module name, used to resolve relative names.
         * @param {Boolean} isNormalized: is the ID already normalized.
         * This is true if this call is done for a define() module ID.
         * @param {Boolean} applyMap: apply the map config to the ID.
         * Should only be true if this map is for a dependency.
         *
         * @returns {Object}
         */
        function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
            var url, pluginModule, suffix,
                index = name ? name.indexOf('!') : -1,
                prefix = null,
                parentName = parentModuleMap ? parentModuleMap.name : null,
                originalName = name,
                isDefine = true,
                normalizedName = '';

            //If no name, then it means it is a require call, generate an
            //internal name.
            if (!name) {
                isDefine = false;
                name = '_@r' + (requireCounter += 1);
            }

            if (index !== -1) {
                prefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }

            if (prefix) {
                prefix = normalize(prefix, parentName, applyMap);
                pluginModule = defined[prefix];
            }

            //Account for relative paths if there is a base name.
            if (name) {
                if (prefix) {
                    if (pluginModule && pluginModule.normalize) {
                        //Plugin is loaded, use its normalize method.
                        normalizedName = pluginModule.normalize(name, function (name) {
                            return normalize(name, parentName, applyMap);
                        });
                    } else {
                        normalizedName = normalize(name, parentName, applyMap);
                    }
                } else {
                    //A regular module.
                    normalizedName = normalize(name, parentName, applyMap);
                    url = context.nameToUrl(normalizedName);
                }
            }

            //If the id is a plugin id that cannot be determined if it needs
            //normalization, stamp it with a unique ID so two matching relative
            //ids that may conflict can be separate.
            suffix = prefix && !pluginModule && !isNormalized ?
                     '_unnormalized' + (unnormalizedCounter += 1) :
                     '';

            return {
                prefix: prefix,
                name: normalizedName,
                parentMap: parentModuleMap,
                unnormalized: !!suffix,
                url: url,
                originalName: originalName,
                isDefine: isDefine,
                id: (prefix ?
                        prefix + '!' + normalizedName :
                        normalizedName) + suffix
            };
        }

        function getModule(depMap) {
            var id = depMap.id,
                mod = registry[id];

            if (!mod) {
                mod = registry[id] = new context.Module(depMap);
            }

            return mod;
        }

        function on(depMap, name, fn) {
            var id = depMap.id,
                mod = registry[id];

            if (hasProp(defined, id) &&
                    (!mod || mod.defineEmitComplete)) {
                if (name === 'defined') {
                    fn(defined[id]);
                }
            } else {
                getModule(depMap).on(name, fn);
            }
        }

        function onError(err, errback) {
            var ids = err.requireModules,
                notified = false;

            if (errback) {
                errback(err);
            } else {
                each(ids, function (id) {
                    var mod = registry[id];
                    if (mod) {
                        //Set error on module, so it skips timeout checks.
                        mod.error = err;
                        if (mod.events.error) {
                            notified = true;
                            mod.emit('error', err);
                        }
                    }
                });

                if (!notified) {
                    req.onError(err);
                }
            }
        }

        /**
         * Internal method to transfer globalQueue items to this context's
         * defQueue.
         */
        function takeGlobalQueue() {
            //Push all the globalDefQueue items into the context's defQueue
            if (globalDefQueue.length) {
                //Array splice in the values since the context code has a
                //local var ref to defQueue, so cannot just reassign the one
                //on context.
                apsp.apply(defQueue,
                           [defQueue.length - 1, 0].concat(globalDefQueue));
                globalDefQueue = [];
            }
        }

        /**
         * Helper function that creates a require function object to give to
         * modules that ask for it as a dependency. It needs to be specific
         * per module because of the implication of path mappings that may
         * need to be relative to the module name.
         */
        function makeRequire(mod, enableBuildCallback, altRequire) {
            var relMap = mod && mod.map,
                modRequire = makeContextModuleFunc(altRequire || context.require,
                                                   relMap,
                                                   enableBuildCallback);

            addRequireMethods(modRequire, context, relMap);
            modRequire.isBrowser = isBrowser;

            return modRequire;
        }

        handlers = {
            'require': function (mod) {
                return makeRequire(mod);
            },
            'exports': function (mod) {
                mod.usingExports = true;
                if (mod.map.isDefine) {
                    return (mod.exports = defined[mod.map.id] = {});
                }
            },
            'module': function (mod) {
                return (mod.module = {
                    id: mod.map.id,
                    uri: mod.map.url,
                    config: function () {
                        return (config.config && config.config[mod.map.id]) || {};
                    },
                    exports: defined[mod.map.id]
                });
            }
        };

        function removeWaiting(id) {
            //Clean up machinery used for waiting modules.
            delete registry[id];

            each(waitAry, function (mod, i) {
                if (mod.map.id === id) {
                    waitAry.splice(i, 1);
                    if (!mod.defined) {
                        context.waitCount -= 1;
                    }
                    return true;
                }
            });
        }

        function findCycle(mod, traced, processed) {
            var id = mod.map.id,
                depArray = mod.depMaps,
                foundModule;

            //Do not bother with unitialized modules or not yet enabled
            //modules.
            if (!mod.inited) {
                return;
            }

            //Found the cycle.
            if (traced[id]) {
                return mod;
            }

            traced[id] = true;

            //Trace through the dependencies.
            each(depArray, function (depMap) {
                var depId = depMap.id,
                    depMod = registry[depId];

                if (!depMod || processed[depId] ||
                        !depMod.inited || !depMod.enabled) {
                    return;
                }

                return (foundModule = findCycle(depMod, traced, processed));
            });

            processed[id] = true;

            return foundModule;
        }

        function forceExec(mod, traced, uninited) {
            var id = mod.map.id,
                depArray = mod.depMaps;

            if (!mod.inited || !mod.map.isDefine) {
                return;
            }

            if (traced[id]) {
                return defined[id];
            }

            traced[id] = mod;

            each(depArray, function (depMap) {
                var depId = depMap.id,
                    depMod = registry[depId],
                    value;

                if (handlers[depId]) {
                    return;
                }

                if (depMod) {
                    if (!depMod.inited || !depMod.enabled) {
                        //Dependency is not inited,
                        //so this module cannot be
                        //given a forced value yet.
                        uninited[id] = true;
                        return;
                    }

                    //Get the value for the current dependency
                    value = forceExec(depMod, traced, uninited);

                    //Even with forcing it may not be done,
                    //in particular if the module is waiting
                    //on a plugin resource.
                    if (!uninited[depId]) {
                        mod.defineDepById(depId, value);
                    }
                }
            });

            mod.check(true);

            return defined[id];
        }

        function modCheck(mod) {
            mod.check();
        }

        function checkLoaded() {
            var map, modId, err, usingPathFallback,
                waitInterval = config.waitSeconds * 1000,
                //It is possible to disable the wait interval by using waitSeconds of 0.
                expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                noLoads = [],
                stillLoading = false,
                needCycleCheck = true;

            //Do not bother if this call was a result of a cycle break.
            if (inCheckLoaded) {
                return;
            }

            inCheckLoaded = true;

            //Figure out the state of all the modules.
            eachProp(registry, function (mod) {
                map = mod.map;
                modId = map.id;

                //Skip things that are not enabled or in error state.
                if (!mod.enabled) {
                    return;
                }

                if (!mod.error) {
                    //If the module should be executed, and it has not
                    //been inited and time is up, remember it.
                    if (!mod.inited && expired) {
                        if (hasPathFallback(modId)) {
                            usingPathFallback = true;
                            stillLoading = true;
                        } else {
                            noLoads.push(modId);
                            removeScript(modId);
                        }
                    } else if (!mod.inited && mod.fetched && map.isDefine) {
                        stillLoading = true;
                        if (!map.prefix) {
                            //No reason to keep looking for unfinished
                            //loading. If the only stillLoading is a
                            //plugin resource though, keep going,
                            //because it may be that a plugin resource
                            //is waiting on a non-plugin cycle.
                            return (needCycleCheck = false);
                        }
                    }
                }
            });

            if (expired && noLoads.length) {
                //If wait time expired, throw error of unloaded modules.
                err = makeError('timeout', 'Load timeout for modules: ' + noLoads, null, noLoads);
                err.contextName = context.contextName;
                return onError(err);
            }

            //Not expired, check for a cycle.
            if (needCycleCheck) {

                each(waitAry, function (mod) {
                    if (mod.defined) {
                        return;
                    }

                    var cycleMod = findCycle(mod, {}, {}),
                        traced = {};

                    if (cycleMod) {
                        forceExec(cycleMod, traced, {});

                        //traced modules may have been
                        //removed from the registry, but
                        //their listeners still need to
                        //be called.
                        eachProp(traced, modCheck);
                    }
                });

                //Now that dependencies have
                //been satisfied, trigger the
                //completion check that then
                //notifies listeners.
                eachProp(registry, modCheck);
            }

            //If still waiting on loads, and the waiting load is something
            //other than a plugin resource, or there are still outstanding
            //scripts, then just try back later.
            if ((!expired || usingPathFallback) && stillLoading) {
                //Something is still waiting to load. Wait for it, but only
                //if a timeout is not already in effect.
                if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
                    checkLoadedTimeoutId = setTimeout(function () {
                        checkLoadedTimeoutId = 0;
                        checkLoaded();
                    }, 50);
                }
            }

            inCheckLoaded = false;
        }

        Module = function (map) {
            this.events = undefEvents[map.id] || {};
            this.map = map;
            this.shim = config.shim[map.id];
            this.depExports = [];
            this.depMaps = [];
            this.depMatched = [];
            this.pluginMaps = {};
            this.depCount = 0;

            /* this.exports this.factory
               this.depMaps = [],
               this.enabled, this.fetched
            */
        };

        Module.prototype = {
            init: function (depMaps, factory, errback, options) {
                options = options || {};

                //Do not do more inits if already done. Can happen if there
                //are multiple define calls for the same module. That is not
                //a normal, common case, but it is also not unexpected.
                if (this.inited) {
                    return;
                }

                this.factory = factory;

                if (errback) {
                    //Register for errors on this module.
                    this.on('error', errback);
                } else if (this.events.error) {
                    //If no errback already, but there are error listeners
                    //on this module, set up an errback to pass to the deps.
                    errback = bind(this, function (err) {
                        this.emit('error', err);
                    });
                }

                //Do a copy of the dependency array, so that
                //source inputs are not modified. For example
                //"shim" deps are passed in here directly, and
                //doing a direct modification of the depMaps array
                //would affect that config.
                this.depMaps = depMaps && depMaps.slice(0);
                this.depMaps.rjsSkipMap = depMaps.rjsSkipMap;

                this.errback = errback;

                //Indicate this module has be initialized
                this.inited = true;

                this.ignore = options.ignore;

                //Could have option to init this module in enabled mode,
                //or could have been previously marked as enabled. However,
                //the dependencies are not known until init is called. So
                //if enabled previously, now trigger dependencies as enabled.
                if (options.enabled || this.enabled) {
                    //Enable this module and dependencies.
                    //Will call this.check()
                    this.enable();
                } else {
                    this.check();
                }
            },

            defineDepById: function (id, depExports) {
                var i;

                //Find the index for this dependency.
                each(this.depMaps, function (map, index) {
                    if (map.id === id) {
                        i = index;
                        return true;
                    }
                });

                return this.defineDep(i, depExports);
            },

            defineDep: function (i, depExports) {
                //Because of cycles, defined callback for a given
                //export can be called more than once.
                if (!this.depMatched[i]) {
                    this.depMatched[i] = true;
                    this.depCount -= 1;
                    this.depExports[i] = depExports;
                }
            },

            fetch: function () {
                if (this.fetched) {
                    return;
                }
                this.fetched = true;

                context.startTime = (new Date()).getTime();

                var map = this.map;

                //If the manager is for a plugin managed resource,
                //ask the plugin to load it now.
                if (this.shim) {
                    makeRequire(this, true)(this.shim.deps || [], bind(this, function () {
                        return map.prefix ? this.callPlugin() : this.load();
                    }));
                } else {
                    //Regular dependency.
                    return map.prefix ? this.callPlugin() : this.load();
                }
            },

            load: function () {
                var url = this.map.url;

                //Regular dependency.
                if (!urlFetched[url]) {
                    urlFetched[url] = true;
                    context.load(this.map.id, url);
                }
            },

            /**
             * Checks is the module is ready to define itself, and if so,
             * define it. If the silent argument is true, then it will just
             * define, but not notify listeners, and not ask for a context-wide
             * check of all loaded modules. That is useful for cycle breaking.
             */
            check: function (silent) {
                if (!this.enabled || this.enabling) {
                    return;
                }

                var err, cjsModule,
                    id = this.map.id,
                    depExports = this.depExports,
                    exports = this.exports,
                    factory = this.factory;

                if (!this.inited) {
                    this.fetch();
                } else if (this.error) {
                    this.emit('error', this.error);
                } else if (!this.defining) {
                    //The factory could trigger another require call
                    //that would result in checking this module to
                    //define itself again. If already in the process
                    //of doing that, skip this work.
                    this.defining = true;

                    if (this.depCount < 1 && !this.defined) {
                        if (isFunction(factory)) {
                            //If there is an error listener, favor passing
                            //to that instead of throwing an error.
                            if (this.events.error) {
                                try {
                                    exports = context.execCb(id, factory, depExports, exports);
                                } catch (e) {
                                    err = e;
                                }
                            } else {
                                exports = context.execCb(id, factory, depExports, exports);
                            }

                            if (this.map.isDefine) {
                                //If setting exports via 'module' is in play,
                                //favor that over return value and exports. After that,
                                //favor a non-undefined return value over exports use.
                                cjsModule = this.module;
                                if (cjsModule &&
                                        cjsModule.exports !== undefined &&
                                        //Make sure it is not already the exports value
                                        cjsModule.exports !== this.exports) {
                                    exports = cjsModule.exports;
                                } else if (exports === undefined && this.usingExports) {
                                    //exports already set the defined value.
                                    exports = this.exports;
                                }
                            }

                            if (err) {
                                err.requireMap = this.map;
                                err.requireModules = [this.map.id];
                                err.requireType = 'define';
                                return onError((this.error = err));
                            }

                        } else {
                            //Just a literal value
                            exports = factory;
                        }

                        this.exports = exports;

                        if (this.map.isDefine && !this.ignore) {
                            defined[id] = exports;

                            if (req.onResourceLoad) {
                                req.onResourceLoad(context, this.map, this.depMaps);
                            }
                        }

                        //Clean up
                        delete registry[id];

                        this.defined = true;
                        context.waitCount -= 1;
                        if (context.waitCount === 0) {
                            //Clear the wait array used for cycles.
                            waitAry = [];
                        }
                    }

                    //Finished the define stage. Allow calling check again
                    //to allow define notifications below in the case of a
                    //cycle.
                    this.defining = false;

                    if (!silent) {
                        if (this.defined && !this.defineEmitted) {
                            this.defineEmitted = true;
                            this.emit('defined', this.exports);
                            this.defineEmitComplete = true;
                        }
                    }
                }
            },

            callPlugin: function () {
                var map = this.map,
                    id = map.id,
                    pluginMap = makeModuleMap(map.prefix, null, false, true);

                on(pluginMap, 'defined', bind(this, function (plugin) {
                    var load, normalizedMap, normalizedMod,
                        name = this.map.name,
                        parentName = this.map.parentMap ? this.map.parentMap.name : null;

                    //If current map is not normalized, wait for that
                    //normalized name to load instead of continuing.
                    if (this.map.unnormalized) {
                        //Normalize the ID if the plugin allows it.
                        if (plugin.normalize) {
                            name = plugin.normalize(name, function (name) {
                                return normalize(name, parentName, true);
                            }) || '';
                        }

                        normalizedMap = makeModuleMap(map.prefix + '!' + name,
                                                      this.map.parentMap,
                                                      false,
                                                      true);
                        on(normalizedMap,
                            'defined', bind(this, function (value) {
                                this.init([], function () { return value; }, null, {
                                    enabled: true,
                                    ignore: true
                                });
                            }));
                        normalizedMod = registry[normalizedMap.id];
                        if (normalizedMod) {
                            if (this.events.error) {
                                normalizedMod.on('error', bind(this, function (err) {
                                    this.emit('error', err);
                                }));
                            }
                            normalizedMod.enable();
                        }

                        return;
                    }

                    load = bind(this, function (value) {
                        this.init([], function () { return value; }, null, {
                            enabled: true
                        });
                    });

                    load.error = bind(this, function (err) {
                        this.inited = true;
                        this.error = err;
                        err.requireModules = [id];

                        //Remove temp unnormalized modules for this module,
                        //since they will never be resolved otherwise now.
                        eachProp(registry, function (mod) {
                            if (mod.map.id.indexOf(id + '_unnormalized') === 0) {
                                removeWaiting(mod.map.id);
                            }
                        });

                        onError(err);
                    });

                    //Allow plugins to load other code without having to know the
                    //context or how to 'complete' the load.
                    load.fromText = function (moduleName, text) {
                        /*jslint evil: true */
                        var hasInteractive = useInteractive;

                        //Turn off interactive script matching for IE for any define
                        //calls in the text, then turn it back on at the end.
                        if (hasInteractive) {
                            useInteractive = false;
                        }

                        //Prime the system by creating a module instance for
                        //it.
                        getModule(makeModuleMap(moduleName));

                        req.exec(text);

                        if (hasInteractive) {
                            useInteractive = true;
                        }

                        //Support anonymous modules.
                        context.completeLoad(moduleName);
                    };

                    //Use parentName here since the plugin's name is not reliable,
                    //could be some weird string with no path that actually wants to
                    //reference the parentName's path.
                    plugin.load(map.name, makeRequire(map.parentMap, true, function (deps, cb, er) {
                        deps.rjsSkipMap = true;
                        return context.require(deps, cb, er);
                    }), load, config);
                }));

                context.enable(pluginMap, this);
                this.pluginMaps[pluginMap.id] = pluginMap;
            },

            enable: function () {
                this.enabled = true;

                if (!this.waitPushed) {
                    waitAry.push(this);
                    context.waitCount += 1;
                    this.waitPushed = true;
                }

                //Set flag mentioning that the module is enabling,
                //so that immediate calls to the defined callbacks
                //for dependencies do not trigger inadvertent load
                //with the depCount still being zero.
                this.enabling = true;

                //Enable each dependency
                each(this.depMaps, bind(this, function (depMap, i) {
                    var id, mod, handler;

                    if (typeof depMap === 'string') {
                        //Dependency needs to be converted to a depMap
                        //and wired up to this module.
                        depMap = makeModuleMap(depMap,
                                               (this.map.isDefine ? this.map : this.map.parentMap),
                                               false,
                                               !this.depMaps.rjsSkipMap);
                        this.depMaps[i] = depMap;

                        handler = handlers[depMap.id];

                        if (handler) {
                            this.depExports[i] = handler(this);
                            return;
                        }

                        this.depCount += 1;

                        on(depMap, 'defined', bind(this, function (depExports) {
                            this.defineDep(i, depExports);
                            this.check();
                        }));

                        if (this.errback) {
                            on(depMap, 'error', this.errback);
                        }
                    }

                    id = depMap.id;
                    mod = registry[id];

                    //Skip special modules like 'require', 'exports', 'module'
                    //Also, don't call enable if it is already enabled,
                    //important in circular dependency cases.
                    if (!handlers[id] && mod && !mod.enabled) {
                        context.enable(depMap, this);
                    }
                }));

                //Enable each plugin that is used in
                //a dependency
                eachProp(this.pluginMaps, bind(this, function (pluginMap) {
                    var mod = registry[pluginMap.id];
                    if (mod && !mod.enabled) {
                        context.enable(pluginMap, this);
                    }
                }));

                this.enabling = false;

                this.check();
            },

            on: function (name, cb) {
                var cbs = this.events[name];
                if (!cbs) {
                    cbs = this.events[name] = [];
                }
                cbs.push(cb);
            },

            emit: function (name, evt) {
                each(this.events[name], function (cb) {
                    cb(evt);
                });
                if (name === 'error') {
                    //Now that the error handler was triggered, remove
                    //the listeners, since this broken Module instance
                    //can stay around for a while in the registry/waitAry.
                    delete this.events[name];
                }
            }
        };

        function callGetModule(args) {
            getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
        }

        function removeListener(node, func, name, ieName) {
            //Favor detachEvent because of IE9
            //issue, see attachEvent/addEventListener comment elsewhere
            //in this file.
            if (node.detachEvent && !isOpera) {
                //Probably IE. If not it will throw an error, which will be
                //useful to know.
                if (ieName) {
                    node.detachEvent(ieName, func);
                }
            } else {
                node.removeEventListener(name, func, false);
            }
        }

        /**
         * Given an event from a script node, get the requirejs info from it,
         * and then removes the event listeners on the node.
         * @param {Event} evt
         * @returns {Object}
         */
        function getScriptData(evt) {
            //Using currentTarget instead of target for Firefox 2.0's sake. Not
            //all old browsers will be supported, but this one was easy enough
            //to support and still makes sense.
            var node = evt.currentTarget || evt.srcElement;

            //Remove the listeners once here.
            removeListener(node, context.onScriptLoad, 'load', 'onreadystatechange');
            removeListener(node, context.onScriptError, 'error');

            return {
                node: node,
                id: node && node.getAttribute('data-requiremodule')
            };
        }

        return (context = {
            config: config,
            contextName: contextName,
            registry: registry,
            defined: defined,
            urlFetched: urlFetched,
            waitCount: 0,
            defQueue: defQueue,
            Module: Module,
            makeModuleMap: makeModuleMap,

            /**
             * Set a configuration for the context.
             * @param {Object} cfg config object to integrate.
             */
            configure: function (cfg) {
                //Make sure the baseUrl ends in a slash.
                if (cfg.baseUrl) {
                    if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
                        cfg.baseUrl += '/';
                    }
                }

                //Save off the paths and packages since they require special processing,
                //they are additive.
                var pkgs = config.pkgs,
                    shim = config.shim,
                    paths = config.paths,
                    map = config.map;

                //Mix in the config values, favoring the new values over
                //existing ones in context.config.
                mixin(config, cfg, true);

                //Merge paths.
                config.paths = mixin(paths, cfg.paths, true);

                //Merge map
                if (cfg.map) {
                    config.map = mixin(map || {}, cfg.map, true, true);
                }

                //Merge shim
                if (cfg.shim) {
                    eachProp(cfg.shim, function (value, id) {
                        //Normalize the structure
                        if (isArray(value)) {
                            value = {
                                deps: value
                            };
                        }
                        if (value.exports && !value.exports.__buildReady) {
                            value.exports = context.makeShimExports(value.exports);
                        }
                        shim[id] = value;
                    });
                    config.shim = shim;
                }

                //Adjust packages if necessary.
                if (cfg.packages) {
                    each(cfg.packages, function (pkgObj) {
                        var location;

                        pkgObj = typeof pkgObj === 'string' ? { name: pkgObj } : pkgObj;
                        location = pkgObj.location;

                        //Create a brand new object on pkgs, since currentPackages can
                        //be passed in again, and config.pkgs is the internal transformed
                        //state for all package configs.
                        pkgs[pkgObj.name] = {
                            name: pkgObj.name,
                            location: location || pkgObj.name,
                            //Remove leading dot in main, so main paths are normalized,
                            //and remove any trailing .js, since different package
                            //envs have different conventions: some use a module name,
                            //some use a file name.
                            main: (pkgObj.main || 'main')
                                  .replace(currDirRegExp, '')
                                  .replace(jsSuffixRegExp, '')
                        };
                    });

                    //Done with modifications, assing packages back to context config
                    config.pkgs = pkgs;
                }

                //If there are any "waiting to execute" modules in the registry,
                //update the maps for them, since their info, like URLs to load,
                //may have changed.
                eachProp(registry, function (mod, id) {
                    //If module already has init called, since it is too
                    //late to modify them, and ignore unnormalized ones
                    //since they are transient.
                    if (!mod.inited && !mod.map.unnormalized) {
                        mod.map = makeModuleMap(id);
                    }
                });

                //If a deps array or a config callback is specified, then call
                //require with those args. This is useful when require is defined as a
                //config object before require.js is loaded.
                if (cfg.deps || cfg.callback) {
                    context.require(cfg.deps || [], cfg.callback);
                }
            },

            makeShimExports: function (exports) {
                var func;
                if (typeof exports === 'string') {
                    func = function () {
                        return getGlobal(exports);
                    };
                    //Save the exports for use in nodefine checking.
                    func.exports = exports;
                    return func;
                } else {
                    return function () {
                        return exports.apply(global, arguments);
                    };
                }
            },

            requireDefined: function (id, relMap) {
                return hasProp(defined, makeModuleMap(id, relMap, false, true).id);
            },

            requireSpecified: function (id, relMap) {
                id = makeModuleMap(id, relMap, false, true).id;
                return hasProp(defined, id) || hasProp(registry, id);
            },

            require: function (deps, callback, errback, relMap) {
                var moduleName, id, map, requireMod, args;
                if (typeof deps === 'string') {
                    if (isFunction(callback)) {
                        //Invalid call
                        return onError(makeError('requireargs', 'Invalid require call'), errback);
                    }

                    //Synchronous access to one module. If require.get is
                    //available (as in the Node adapter), prefer that.
                    //In this case deps is the moduleName and callback is
                    //the relMap
                    if (req.get) {
                        return req.get(context, deps, callback);
                    }

                    //Just return the module wanted. In this scenario, the
                    //second arg (if passed) is just the relMap.
                    moduleName = deps;
                    relMap = callback;

                    //Normalize module name, if it contains . or ..
                    map = makeModuleMap(moduleName, relMap, false, true);
                    id = map.id;

                    if (!hasProp(defined, id)) {
                        return onError(makeError('notloaded', 'Module name "' +
                                    id +
                                    '" has not been loaded yet for context: ' +
                                    contextName));
                    }
                    return defined[id];
                }

                //Callback require. Normalize args. if callback or errback is
                //not a function, it means it is a relMap. Test errback first.
                if (errback && !isFunction(errback)) {
                    relMap = errback;
                    errback = undefined;
                }
                if (callback && !isFunction(callback)) {
                    relMap = callback;
                    callback = undefined;
                }

                //Any defined modules in the global queue, intake them now.
                takeGlobalQueue();

                //Make sure any remaining defQueue items get properly processed.
                while (defQueue.length) {
                    args = defQueue.shift();
                    if (args[0] === null) {
                        return onError(makeError('mismatch', 'Mismatched anonymous define() module: ' + args[args.length - 1]));
                    } else {
                        //args are id, deps, factory. Should be normalized by the
                        //define() function.
                        callGetModule(args);
                    }
                }

                //Mark all the dependencies as needing to be loaded.
                requireMod = getModule(makeModuleMap(null, relMap));

                requireMod.init(deps, callback, errback, {
                    enabled: true
                });

                checkLoaded();

                return context.require;
            },

            undef: function (id) {
                //Bind any waiting define() calls to this context,
                //fix for #408
                takeGlobalQueue();

                var map = makeModuleMap(id, null, true),
                    mod = registry[id];

                delete defined[id];
                delete urlFetched[map.url];
                delete undefEvents[id];

                if (mod) {
                    //Hold on to listeners in case the
                    //module will be attempted to be reloaded
                    //using a different config.
                    if (mod.events.defined) {
                        undefEvents[id] = mod.events;
                    }

                    removeWaiting(id);
                }
            },

            /**
             * Called to enable a module if it is still in the registry
             * awaiting enablement. parent module is passed in for context,
             * used by the optimizer.
             */
            enable: function (depMap, parent) {
                var mod = registry[depMap.id];
                if (mod) {
                    getModule(depMap).enable();
                }
            },

            /**
             * Internal method used by environment adapters to complete a load event.
             * A load event could be a script load or just a load pass from a synchronous
             * load call.
             * @param {String} moduleName the name of the module to potentially complete.
             */
            completeLoad: function (moduleName) {
                var found, args, mod,
                    shim = config.shim[moduleName] || {},
                    shExports = shim.exports && shim.exports.exports;

                takeGlobalQueue();

                while (defQueue.length) {
                    args = defQueue.shift();
                    if (args[0] === null) {
                        args[0] = moduleName;
                        //If already found an anonymous module and bound it
                        //to this name, then this is some other anon module
                        //waiting for its completeLoad to fire.
                        if (found) {
                            break;
                        }
                        found = true;
                    } else if (args[0] === moduleName) {
                        //Found matching define call for this script!
                        found = true;
                    }

                    callGetModule(args);
                }

                //Do this after the cycle of callGetModule in case the result
                //of those calls/init calls changes the registry.
                mod = registry[moduleName];

                if (!found && !defined[moduleName] && mod && !mod.inited) {
                    if (config.enforceDefine && (!shExports || !getGlobal(shExports))) {
                        if (hasPathFallback(moduleName)) {
                            return;
                        } else {
                            return onError(makeError('nodefine',
                                             'No define call for ' + moduleName,
                                             null,
                                             [moduleName]));
                        }
                    } else {
                        //A script that does not call define(), so just simulate
                        //the call for it.
                        callGetModule([moduleName, (shim.deps || []), shim.exports]);
                    }
                }

                checkLoaded();
            },

            /**
             * Converts a module name + .extension into an URL path.
             * *Requires* the use of a module name. It does not support using
             * plain URLs like nameToUrl.
             */
            toUrl: function (moduleNamePlusExt, relModuleMap) {
                var index = moduleNamePlusExt.lastIndexOf('.'),
                    ext = null;

                if (index !== -1) {
                    ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
                    moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
                }

                return context.nameToUrl(normalize(moduleNamePlusExt, relModuleMap && relModuleMap.id, true),
                                         ext);
            },

            /**
             * Converts a module name to a file path. Supports cases where
             * moduleName may actually be just an URL.
             * Note that it **does not** call normalize on the moduleName,
             * it is assumed to have already been normalized. This is an
             * internal API, not a public one. Use toUrl for the public API.
             */
            nameToUrl: function (moduleName, ext) {
                var paths, pkgs, pkg, pkgPath, syms, i, parentModule, url,
                    parentPath;

                //If a colon is in the URL, it indicates a protocol is used and it is just
                //an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
                //or ends with .js, then assume the user meant to use an url and not a module id.
                //The slash is important for protocol-less URLs as well as full paths.
                if (req.jsExtRegExp.test(moduleName)) {
                    //Just a plain path, not module name lookup, so just return it.
                    //Add extension if it is included. This is a bit wonky, only non-.js things pass
                    //an extension, this method probably needs to be reworked.
                    url = moduleName + (ext || '');
                } else {
                    //A module that needs to be converted to a path.
                    paths = config.paths;
                    pkgs = config.pkgs;

                    syms = moduleName.split('/');
                    //For each module name segment, see if there is a path
                    //registered for it. Start with most specific name
                    //and work up from it.
                    for (i = syms.length; i > 0; i -= 1) {
                        parentModule = syms.slice(0, i).join('/');
                        pkg = pkgs[parentModule];
                        parentPath = paths[parentModule];
                        if (parentPath) {
                            //If an array, it means there are a few choices,
                            //Choose the one that is desired
                            if (isArray(parentPath)) {
                                parentPath = parentPath[0];
                            }
                            syms.splice(0, i, parentPath);
                            break;
                        } else if (pkg) {
                            //If module name is just the package name, then looking
                            //for the main module.
                            if (moduleName === pkg.name) {
                                pkgPath = pkg.location + '/' + pkg.main;
                            } else {
                                pkgPath = pkg.location;
                            }
                            syms.splice(0, i, pkgPath);
                            break;
                        }
                    }

                    //Join the path parts together, then figure out if baseUrl is needed.
                    url = syms.join('/');
                    url += (ext || (/\?/.test(url) ? '' : '.js'));
                    url = (url.charAt(0) === '/' || url.match(/^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;
                }

                return config.urlArgs ? url +
                                        ((url.indexOf('?') === -1 ? '?' : '&') +
                                         config.urlArgs) : url;
            },

            //Delegates to req.load. Broken out as a separate function to
            //allow overriding in the optimizer.
            load: function (id, url) {
                req.load(context, id, url);
            },

            /**
             * Executes a module callack function. Broken out as a separate function
             * solely to allow the build system to sequence the files in the built
             * layer in the right sequence.
             *
             * @private
             */
            execCb: function (name, callback, args, exports) {
                return callback.apply(exports, args);
            },

            /**
             * callback for script loads, used to check status of loading.
             *
             * @param {Event} evt the event from the browser for the script
             * that was loaded.
             */
            onScriptLoad: function (evt) {
                //Using currentTarget instead of target for Firefox 2.0's sake. Not
                //all old browsers will be supported, but this one was easy enough
                //to support and still makes sense.
                if (evt.type === 'load' ||
                        (readyRegExp.test((evt.currentTarget || evt.srcElement).readyState))) {
                    //Reset interactive script so a script node is not held onto for
                    //to long.
                    interactiveScript = null;

                    //Pull out the name of the module and the context.
                    var data = getScriptData(evt);
                    context.completeLoad(data.id);
                }
            },

            /**
             * Callback for script errors.
             */
            onScriptError: function (evt) {
                var data = getScriptData(evt);
                if (!hasPathFallback(data.id)) {
                    return onError(makeError('scripterror', 'Script error', evt, [data.id]));
                }
            }
        });
    }

    /**
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     *
     * Make a local req variable to help Caja compliance (it assumes things
     * on a require that are not standardized), and to give a short
     * name for minification/local scope use.
     */
    req = requirejs = function (deps, callback, errback, optional) {

        //Find the right context, use default
        var context, config,
            contextName = defContextName;

        // Determine if have config object in the call.
        if (!isArray(deps) && typeof deps !== 'string') {
            // deps is a config object
            config = deps;
            if (isArray(callback)) {
                // Adjust args if there are dependencies
                deps = callback;
                callback = errback;
                errback = optional;
            } else {
                deps = [];
            }
        }

        if (config && config.context) {
            contextName = config.context;
        }

        context = contexts[contextName];
        if (!context) {
            context = contexts[contextName] = req.s.newContext(contextName);
        }

        if (config) {
            context.configure(config);
        }

        return context.require(deps, callback, errback);
    };

    /**
     * Support require.config() to make it easier to cooperate with other
     * AMD loaders on globally agreed names.
     */
    req.config = function (config) {
        return req(config);
    };

    /**
     * Export require as a global, but only if it does not already exist.
     */
    if (!require) {
        require = req;
    }

    req.version = version;

    //Used to filter out dependencies that are already paths.
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    req.isBrowser = isBrowser;
    s = req.s = {
        contexts: contexts,
        newContext: newContext
    };

    //Create default context.
    req({});

    //Exports some context-sensitive methods on global require, using
    //default context if no context specified.
    addRequireMethods(req);

    if (isBrowser) {
        head = s.head = document.getElementsByTagName('head')[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName('base')[0];
        if (baseElement) {
            head = s.head = baseElement.parentNode;
        }
    }

    /**
     * Any errors that require explicitly generates will be passed to this
     * function. Intercept/override it if you want custom error handling.
     * @param {Error} err the error object.
     */
    req.onError = function (err) {
        throw err;
    };

    /**
     * Does the request to load a module for the browser case.
     * Make this a separate function to allow other environments
     * to override it.
     *
     * @param {Object} context the require context to find state.
     * @param {String} moduleName the name of the module.
     * @param {Object} url the URL to the module.
     */
    req.load = function (context, moduleName, url) {
        var config = (context && context.config) || {},
            node;
        if (isBrowser) {
            //In the browser so use a script tag
            node = config.xhtml ?
                    document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
                    document.createElement('script');
            node.type = config.scriptType || 'text/javascript';
            node.charset = 'utf-8';
            node.async = true;

            node.setAttribute('data-requirecontext', context.contextName);
            node.setAttribute('data-requiremodule', moduleName);

            //Set up load listener. Test attachEvent first because IE9 has
            //a subtle issue in its addEventListener and script onload firings
            //that do not match the behavior of all other browsers with
            //addEventListener support, which fire the onload event for a
            //script right after the script execution. See:
            //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
            //UNFORTUNATELY Opera implements attachEvent but does not follow the script
            //script execution mode.
            if (node.attachEvent &&
                    //Check if node.attachEvent is artificially added by custom script or
                    //natively supported by browser
                    //read https://github.com/jrburke/requirejs/issues/187
                    //if we can NOT find [native code] then it must NOT natively supported.
                    //in IE8, node.attachEvent does not have toString()
                    //Note the test for "[native code" with no closing brace, see:
                    //https://github.com/jrburke/requirejs/issues/273
                    !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
                    !isOpera) {
                //Probably IE. IE (at least 6-8) do not fire
                //script onload right after executing the script, so
                //we cannot tie the anonymous define call to a name.
                //However, IE reports the script as being in 'interactive'
                //readyState at the time of the define call.
                useInteractive = true;

                node.attachEvent('onreadystatechange', context.onScriptLoad);
                //It would be great to add an error handler here to catch
                //404s in IE9+. However, onreadystatechange will fire before
                //the error handler, so that does not help. If addEvenListener
                //is used, then IE will fire error before load, but we cannot
                //use that pathway given the connect.microsoft.com issue
                //mentioned above about not doing the 'script execute,
                //then fire the script load event listener before execute
                //next script' that other browsers do.
                //Best hope: IE10 fixes the issues,
                //and then destroys all installs of IE 6-9.
                //node.attachEvent('onerror', context.onScriptError);
            } else {
                node.addEventListener('load', context.onScriptLoad, false);
                node.addEventListener('error', context.onScriptError, false);
            }
            node.src = url;

            //For some cache cases in IE 6-8, the script executes before the end
            //of the appendChild execution, so to tie an anonymous define
            //call to the module name (which is stored on the node), hold on
            //to a reference to this node, but clear after the DOM insertion.
            currentlyAddingScript = node;
            if (baseElement) {
                head.insertBefore(node, baseElement);
            } else {
                head.appendChild(node);
            }
            currentlyAddingScript = null;

            return node;
        } else if (isWebWorker) {
            //In a web worker, use importScripts. This is not a very
            //efficient use of importScripts, importScripts will block until
            //its script is downloaded and evaluated. However, if web workers
            //are in play, the expectation that a build has been done so that
            //only one script needs to be loaded anyway. This may need to be
            //reevaluated if other use cases become common.
            importScripts(url);

            //Account for anonymous modules
            context.completeLoad(moduleName);
        }
    };

    function getInteractiveScript() {
        if (interactiveScript && interactiveScript.readyState === 'interactive') {
            return interactiveScript;
        }

        eachReverse(scripts(), function (script) {
            if (script.readyState === 'interactive') {
                return (interactiveScript = script);
            }
        });
        return interactiveScript;
    }

    //Look for a data-main script attribute, which could also adjust the baseUrl.
    if (isBrowser) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        eachReverse(scripts(), function (script) {
            //Set the 'head' where we can append children by
            //using the script's parent.
            if (!head) {
                head = script.parentNode;
            }

            //Look for a data-main attribute to set main script for the page
            //to load. If it is there, the path to data main becomes the
            //baseUrl, if it is not already set.
            dataMain = script.getAttribute('data-main');
            if (dataMain) {
                //Set final baseUrl if there is not already an explicit one.
                if (!cfg.baseUrl) {
                    //Pull off the directory of data-main for use as the
                    //baseUrl.
                    src = dataMain.split('/');
                    mainScript = src.pop();
                    subPath = src.length ? src.join('/')  + '/' : './';

                    cfg.baseUrl = subPath;
                    dataMain = mainScript;
                }

                //Strip off any trailing .js since dataMain is now
                //like a module name.
                dataMain = dataMain.replace(jsSuffixRegExp, '');

                //Put the data-main script in the files to load.
                cfg.deps = cfg.deps ? cfg.deps.concat(dataMain) : [dataMain];

                return true;
            }
        });
    }

    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    define = function (name, deps, callback) {
        var node, context;

        //Allow for anonymous modules
        if (typeof name !== 'string') {
            //Adjust args appropriately
            callback = deps;
            deps = name;
            name = null;
        }

        //This module may not have dependencies
        if (!isArray(deps)) {
            callback = deps;
            deps = [];
        }

        //If no name, and callback is a function, then figure out if it a
        //CommonJS thing with dependencies.
        if (!deps.length && isFunction(callback)) {
            //Remove comments from the callback string,
            //look for require calls, and pull them into the dependencies,
            //but only if there are function args.
            if (callback.length) {
                callback
                    .toString()
                    .replace(commentRegExp, '')
                    .replace(cjsRequireRegExp, function (match, dep) {
                        deps.push(dep);
                    });

                //May be a CommonJS thing even without require calls, but still
                //could use exports, and module. Avoid doing exports and module
                //work though if it just needs require.
                //REQUIRES the function to expect the CommonJS variables in the
                //order listed below.
                deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(deps);
            }
        }

        //If in IE 6-8 and hit an anonymous define() call, do the interactive
        //work.
        if (useInteractive) {
            node = currentlyAddingScript || getInteractiveScript();
            if (node) {
                if (!name) {
                    name = node.getAttribute('data-requiremodule');
                }
                context = contexts[node.getAttribute('data-requirecontext')];
            }
        }

        //Always save off evaluating the def call until the script onload handler.
        //This allows multiple modules to be in a file without prematurely
        //tracing dependencies, and allows for anonymous module support,
        //where the module name is not known until the script onload event
        //occurs. If no context, use the global queue, and get it processed
        //in the onscript load callback.
        (context ? context.defQueue : globalDefQueue).push([name, deps, callback]);
    };

    define.amd = {
        jQuery: true
    };


    /**
     * Executes the text. Normally just uses eval, but can be modified
     * to use a better, environment-specific call. Only used for transpiling
     * loader plugins, not for plain JS modules.
     * @param {String} text the text to execute/evaluate.
     */
    req.exec = function (text) {
        /*jslint evil: true */
        return eval(text);
    };

    //Set up with config info.
    req(cfg);
}(this));

// ------------------------------------------------------------------------------
// Tetra.js
//
// Dependencies loader using require.js
// ------------------------------------------------------------------------------
// Copyright (c) Viadeo/APVO Corp., Olivier Hory and other Tetra contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// ------------------------------------------------------------------------------
tetra.extend('dep', function(_conf, _mod, _) {
	
	requirejs.config({
	    //By default load any module IDs from js/lib
	    baseUrl: _conf.APPS_PATH,
	    enforceDefine: true,
		urlArgs: _conf.jsVersion ? 'v=' + _conf.jsVersion : '',
	    //except, if the module ID starts with "app",
	    //load it from the js/app directory. paths
	    //config is relative to the baseUrl, and
	    //never includes a ".js" extension since
	    //the paths config could be for a directory.
	    paths: {
	        g: _conf.GLOBAL_PATH,
	        comp: _conf.COMP_PATH
	    }
	});
	
	return {
		define: define,
		undef: requirejs.undef,
		require: require
	};
	
});
// ------------------------------------------------------------------------------
// Tetra.js
//
// Templating system
// * Client side (client-micro-tmpl.js) use John Resig micro-templating system
// with a special component management
// * Server side (node.js) use ejs templating system module for Express.js
// * Separators: {% and %} in both implementation
// ------------------------------------------------------------------------------
// Copyright (c) Viadeo/APVO Corp., Olivier Hory and other Tetra contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// ------------------------------------------------------------------------------
tetra.extend('tmpl', function(_conf, _mod, _) {

	// Simple JavaScript Templating
	// John Resig - http://ejohn.org/ - MIT Licensed
	(function(){
	  var
		cache = {},
		left = "<%",
		right = "%>",
		key = "%",
		rg1 = new RegExp("'(?=[^" + key + "]*" + right + ")", "g"),
		rg2 = new RegExp(left + "[=-](.+?)" + right, "g")
	  ;
	 
	  this.tmpl = function tmpl(str, data, tag){
		
		if(tag) {
			left = tag.left || left;
			right = tag.right || right;
			key = tag.right[0] || key;
			rg1 = new RegExp("'(?=[^" + key + "]*" + right + ")", "g");
			rg2 = new RegExp(left + "[=-](.+?)" + right, "g");
		}
		
		try {
		    // Figure out if we're getting a template, or if we need to
		    // load the template - and be sure to cache the result.
		    var fn = !/\W/.test(str) ?
		      cache[str] = cache[str] ||
		        tmpl(document.getElementById(str).innerHTML) :
		     
		      // Generate a reusable function that will serve as a template
		      // generator (and which will be cached).
		      new Function("obj",
		        "var p=[],print=function(){p.push.apply(p,arguments);};" +
		       
		        // Introduce the data as local variables using with(){}
		        "with(obj){p.push('" +
		       
		        // Convert the template into pure JavaScript
		        /*str
		          .replace(/[\r\t\n]/g, " ")
		          .split("<%").join("\t")
		          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
		          .replace(/\t=(.*?)%>/g, "',$1,'")
		          .split("\t").join("');")
		          .split("%>").join("p.push('")
		          .split("\r").join("\\'")
		      + "');}return p.join('');");*/
		        str.replace(/[\r\t\n]/g, " ")
				   .replace(rg1,"\t")
				   .split("'").join("\\'")
				   .split("\t").join("'")
				   .replace(rg2, "',$1,'")
				   .split(left).join("');")
				   .split(right).join("p.push('")
			  + "');}return p.join('');");
		    
		    // Provide some basic currying to the user
		    return data ? fn( data ) : fn;
		} catch(err) {
		    if(typeof console !== "undefined") {
		        console.error(err.message, err);
		    }
		    
		    return "";
		}
	  };
	})();
	
	var
		_tmplConf = {left: '{%', right: '%}'}
		_tmplStack = {},
		
		_component = function(uid, scope, ctrl, parentid) {
			return function(actionName, data, ctrlName) {
				if(!data) data = {};
				if(!ctrlName && ctrl) ctrlName = ctrl;
				
				if(_tmplStack[uid]) {
					var
						id = ctrlName ? 'tmpl_' + ctrlName + '_' + actionName : 'tmpl_' + actionName,
						cid = parentid? parentid + '_' + _tmplStack[uid].comp[parentid].countid++ : id + '_' + _tmplStack[uid].countid++
					;
					
					// Intialize and call component
					if(!_tmplStack[uid].comp[cid]) {
						_tmplStack[uid].count++;
						if(parentid) {
							_tmplStack[uid].comp[parentid].count++;
						}
						
						// Add component to the stack
						_tmplStack[uid].comp[cid] = {id: id, data: data, count: 0, countid: 0, parentid: parentid, html: false};
						
						// Execute the action of the component
						if(ctrlName) {
							tetra.controller.exec(actionName, ctrlName, data, undefined, scope, uid, cid);
						} else {
							tetra.controller.exec(actionName, data, undefined, scope, uid, cid);
						}
					}
				}
					
				// Return generated html if available or false if the response is pending
				if(_tmplStack[uid]) {
					return _tmplStack[uid].comp[cid].html;
				}
			};
		},
		_render = function(uid, cid, ctrl, isComp) {
			var html = "";
			
			if(_tmplStack[uid].count == 0) {
				
				// Render the full template
				_tmplStack[uid].countid = 0;
				html = tmpl(_tmplStack[uid].id, _tmplStack[uid].data, _tmplConf);
				
				if(_tmplStack[uid]) {
					// Return generated html to the view callback
					_tmplStack[uid].cbk(html);
					
					// Remove template from stack
					delete _tmplStack[uid];
				}
				
			} else if(isComp) {
				
				var
					comp = _tmplStack[uid].comp[cid]
				;
				
				// Evaluate the component of all his children are available
				if(comp.html === false && comp.count == 0) {
					_tmplStack[uid].comp[cid].countid = 0;
					comp.html = tmpl(comp.id, comp.data, _tmplConf);
					_tmplStack[uid].count--;
				}
				
				// Render the parent template
				if(comp.html !== false) {
					if(comp.parentid) {
						_render(uid, comp.parentid, ctrl, true);
					} else {
						_render(uid, undefined, ctrl, false);
					}
				}
			}
		}
	;
	
	return function(template, data, callback, scope, uid, cid) {
		var
			now = new Date(),
			tpl = template.split('/'),
			id = (/\W/.test(template.replace('/',''))) ? template : (tpl.length == 1) ? 'tmpl_' + tpl[0] : 'tmpl_' + tpl[0] + '_' + tpl[1],
			cid = cid ? cid : id,
			isComp = (uid && _tmplStack[uid].comp[cid] && _tmplStack[uid].comp[cid].html === false),
			html = ""
		;
		
		// Break when the template is not in the DOM
		if(document.getElementById(id) === null && !/\W/.test(id)) {
			throw new Error("the HTML template '"+ id +"' is missing in the DOM.");
		}
		
		// Initialize the root template on the stack
		if(!uid) {
			uid = cid + '_' + now.getTime();
			_tmplStack[uid] = {id: id, data: data, comp: {}, count: 0, countid: 0, cbk: callback};
		}
		
		// Process the current template
		data.component = _component(uid, scope, tpl[0], isComp ? cid : undefined);
		html = tmpl(id, data, _tmplConf);
		
		if(_tmplStack[uid]) {
			
			// Store directly evaluated template
			if(isComp) {
				var
					comp = _tmplStack[uid].comp[cid]
				;
				
				if(comp.count == 0) {
					_tmplStack[uid].comp[cid].html = html;
					if(_tmplStack[uid].comp[cid].parentid) {
						_tmplStack[uid].comp[_tmplStack[uid].comp[cid].parentid].count--;
					}
					_tmplStack[uid].count--;
				}
			}
			
			// Try to render after each evaluation
			_render(uid, cid, (tpl.length == 1) ? tpl[0] : undefined, isComp);
		}
	};
	
});

// ------------------------------------------------------------------------------
// Tetra.js
// Native view functions of Tetra.js
// ------------------------------------------------------------------------------
// Copyright (c) Viadeo/APVO Corp., Olivier Hory and other Tetra contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// ------------------------------------------------------------------------------
tetra.extend('view', function(_conf, _mod, _) {
	
	var
		_views = {}, // view objects
		_comp = {}, // loaded components
		_debug
	;
	
	
	// Event listeners
	// --------------------
	var
		_listenedEvents = {},
		
		_windowEvents = {},
		
		_nonBubblingEvents = {
			change: ['input', 'select'],
			submit: ['form'],
			scroll: ['div', 'textarea', 'ul'],
			select: ['input']
		},
		
		_nonBubblingLimited = {
			change: true,
			submit: true,
			select: true
		},
		
		_mouse = {},
		_clickout = {},
		
		_isBubblingSupported = function(eventName) {
			var elm = document.createElement('div');
			eventName = 'on' + eventName;
			
			var isSupported = (eventName in elm);
			if (!isSupported) {
				elm.setAttribute(eventName, 'return;');
				isSupported = (typeof elm[eventName] === 'function');
			}
			
			elm = null;
			return isSupported;
		},
		
		_callEventListener = function(e, target, boot) {
			
			var
				eventName = e.type,
				found = false,
				listenedEvents
			;
			
			if (eventName === 'click' && e.button && e.button === 2) { 
				return;
			}
			
			if (eventName === 'focusin') {
				eventName = 'focus';
			}
			else if (eventName === 'focusout') {
				eventName = 'blur';
			}
			
			boot = (typeof boot === 'undefined') ? true : false;
			
			if(!boot) { 
				_mod.debug.log('view : call ' + eventName + ' listener', 'all', 'info');
			}
			
			listenedEvents = _listenedEvents[eventName];
			if(typeof listenedEvents !== 'undefined' && listenedEvents.length > 0) {
				var 
					emptyFnc = function(){},
					elm,
					path,
					m
				;
				
				for(var i = 0, len = listenedEvents.length; i < len; i++) {
					var
						viewName = listenedEvents[i],
						thisView = _views[viewName],
						userEvents,
						mouseOverCalled = false
					;
					
					if((typeof thisView.root === 'undefined' && e.target.tagName !== 'HTML' && e.target.parentNode && e.target.parentNode.tagName) ||
							(target.parents('#' + thisView.root).length > 0)) {
						
						userEvents = thisView.events.user[eventName];
						for(var selector in userEvents) {
							if(userEvents.hasOwnProperty(selector)) {
								elm = target;
								if(typeof elm.is === 'function' && !elm.is(selector)) {
									if(typeof elm.parents === 'function') {
										elm = elm.parents(selector);
										elm = (elm.length > 0) ? _(elm[0]) : false;
									}
								}
								
								if(elm) {
									
									// clickout management
									if(eventName === 'click' &&
											typeof thisView.events.user.clickout !== 'undefined' &&
											typeof thisView.events.user.clickout[selector] !== 'undefined' &&
											(!elm.hasClass('cur-clickout') || typeof _clickout[viewName] === 'undefined' || typeof _clickout[viewName][selector] === 'undefined')) {
									   
										if(!_clickout[viewName]) _clickout[viewName] = {};
										if(!_clickout[viewName][selector]) _clickout[viewName][selector] = 1;
										else _clickout[viewName][selector]++;
									   
										var
											cur = {
												view: thisView,
												viewName: viewName,
												eventName: eventName,
												elm: elm,
												selector: selector
											},
											curClass = "clickout-" + _clickout[viewName][selector]
										;
										
										var clickoutCbk = function(e) {
											if(_.toggleLib) _.toggleLib(cur.view.has_);
											
											var isCurClass = _(e.target).is('.' + curClass);
											var hasParents = _(e.target).parents('.' + curClass).length > 0;
											
											if(!isCurClass && !hasParents) {
												_mod.debug.log('view ' + cur.viewName + ' : call clickout callback on ' + cur.selector, cur.view.scope, 'info');
												cur.elm.removeClass('cur-clickout').removeClass(curClass);
												_unbindEvent(document, 'click', clickoutCbk);
												cur.view.events.user.clickout[cur.selector](e,(cur.view.has_) ? cur.elm : _(cur.elm[0])[0]);
											}
										};
										
										elm.addClass('cur-clickout').addClass(curClass);
										
										_bindEvent(document, 'click', clickoutCbk);
									}
									
									// mouseout spam removing (equivalent to mouseleave)
									else if(eventName === 'mouseover') {
										if(_.toggleLib) _.toggleLib(thisView.has_);
										
										if(elm.hasClass('cur-mouseout') && elm.hasClass('cur-mouse-'+ viewName.replace('/', '-'))) {
											elm = false;
										} else {
											for(m in _mouse) {
												_mouse[m].view.events.user.mouseout[_mouse[m].selector](_mouse[m].event, (_mouse[m].view.has_) ? _mouse[m].elm : _mouse[m].elm[0]);
												_mouse[m].elm.removeClass('cur-mouseout').removeClass('cur-mouse-'+ _mouse[m].viewName);
												delete _mouse[m];
											}
											if(typeof thisView.events.user.mouseout !== 'undefined' && 
												typeof thisView.events.user.mouseout[selector] != 'undefined') {
												elm.addClass('cur-mouseout').addClass('cur-mouse-'+ viewName.replace('/', '-'));
											}
										}
										
										mouseOverCalled = true;
									}
									
									else if (eventName === 'mouseout') {
										var ev = _.extend({},e);
										
										ev.type = eventName;
										ev.target = e.target;
										ev.preventDefault = emptyFnc;
										
										_mouse[viewName + '/' + selector] = {
											view: thisView,
											viewName: viewName.replace('/', '-'),
											event: ev,
											elm: elm,
											selector: selector
										};
										
										elm = false;
									}
									
									// scroll event cleaning on parent element
									else if (eventName === 'scroll') {
										if(!target.is(selector)) elm = false;
									}
									
								}
								
								if(elm) {
									// TODO Lot of matching and DOM access here
									if(!(target.hasClass('no-prevent') || target.parents('.no-prevent').length > 0 ||
											((elm.is('input') || elm.is('textarea')) &&
											(eventName === 'keydown' || elm.attr('type') === 'checkbox' ||
											elm.attr('type') === 'radio')))) {
										e.preventDefault();
									}
									
									_mod.debug.log('view ' + viewName + ' : call ' + eventName +
											' callback on ' + selector, thisView.scope, 'info');
									
									if(!thisView.has_) {
										elm = _(elm[0])[0];
									}
									
									if(_.toggleLib) _.toggleLib(thisView.has_);
									
									userEvents[selector](e, elm);
									
									found = true;
								}
							}
						}
					}
					
					if(eventName === 'mouseover' && !mouseOverCalled && target.parents('.cur-mouseout').length === 0) {
						for(m in _mouse) {
							_mouse[m].view.events.user.mouseout[_mouse[m].selector](_mouse[m].event, (_mouse[m].view.has_) ? _mouse[m].elm : _mouse[m].elm[0]);
							_mouse[m].elm.removeClass('cur-mouseout').removeClass('cur-mouse-'+ _mouse[m].viewName);
							delete _mouse[m];
						}
					}
				}
				
				if (boot && !found) {
					_callBootstrap(e, target);
				}
			} else if (boot) {
				_callBootstrap(e, target);
			}
		},
		
		_convertEventName = function(eventName) {
			if(eventName === 'clickout') {
				return 'click';
			} else {
				var addEvent = !!document.addEventListener;
				if (!addEvent && eventName === 'focus') {
					return 'focusin';
				} else if (!addEvent && eventName === 'blur') {
					return 'focusout';
				}
			}
			return eventName;
		},
		
		_bindEvent = function(elm, eventName, callback) {
            eventName = _convertEventName(eventName);
			// Special case for focus and blur under modern browsers
			if(eventName === 'focus' || eventName === 'blur') {
				document.addEventListener(eventName, callback, true);
			} else {
				_(elm).bind(eventName, callback);
			}
		},
		
		_unbindEvent = function(elm, eventName, callback) {
            eventName = _convertEventName(eventName);
			// Special case for focus and blur under modern browsers
			if(eventName === 'focus' || eventName === 'blur') {
				document.removeEventListener(eventName, callback, true);
			} else {
				_(elm).unbind(eventName, callback);
			}
		},
		
		_eventListenerCallback = function(e){
			_callEventListener(e, _(e.target));
		},
		
		_addEventListener = function(eventName) {
		    if(eventName === 'clickout') {
		        eventName = 'click';
            }
			
			if(typeof _listenedEvents[eventName] === 'undefined') {
				_listenedEvents[eventName] = [];
				
				if(typeof _nonBubblingEvents[eventName] !== 'undefined' &&
						(typeof _nonBubblingLimited[eventName] === 'undefined' || !_isBubblingSupported(eventName))) {
				    
					if(_conf.domLoaded) {
						_addNonBubblingEventListener(eventName);
					} else {
						_(document).ready(function(){
							_addNonBubblingEventListener(eventName);
						});
					}
				} else {
					_bindEvent(document, eventName, _eventListenerCallback);
				}
				
				_mod.debug.log('view : now listening ' + eventName, 'all', 'info');
			}
		},
		
		_addNonBubblingEventListener = function(eventName, elements) {
			if(typeof elements === 'undefined') {
				elements = _('body').find(_nonBubblingEvents[eventName].join(','));
			}
			for(var i = 0, len = elements.length; i < len; i++) {
				_bindEvent(elements[i], eventName, _eventListenerCallback);
			}
		},
		
		_removeNonBubblingEventListener = function(eventName, elements) {
			if(typeof elements === 'undefined') {
				elements = _('body').find(_nonBubblingEvents[eventName].join(','));
			}
			for(var i = 0, len = elements.length; i < len; i++) {
				_unbindEvent(elements[i], eventName, _eventListenerCallback);
			}
		},
		
		_customNonBubblingEventListener =  function(eventName, elements) {
			if(_conf.domLoaded && typeof _nonBubblingEvents[eventName] !== 'undefined' &&
				(typeof _nonBubblingLimited[eventName] === 'undefined' || !_isBubblingSupported(eventName))) {
				
				_addNonBubblingEventListener(eventName, elements);
			}
		}
	;
	
	
	// Bootstrap feature
	// --------------------
	var
		_bootstrapEvents = ["click", "mouseover", "focus"],
		
		_callBootstrap = function(e, target) {
			var 
				bootnode,
				viewName,
				compName,
				appPath,
				eventName,
				ev
			;
			
			// Retrict loading to the events defined in the array _bootstrapEvents
			if(e.type && e.target.parentNode && e.target.parentNode.tagName && _.inArray(e.type.toLowerCase(), _bootstrapEvents) !== -1) {
				bootnode = target.hasClass('bootnode') ? target : target.parents('.bootnode');
				if (bootnode.length > 0) {
					viewName = bootnode.attr('data-view');
					compName = bootnode.attr('data-comp');
					eventName = e.type;
					
					ev = _.extend({}, e);
					ev.type = eventName;
					ev.preventDefault = function(){};
					
					if(typeof viewName != 'undefined') {
						if(bootnode.attr('data-event') === eventName && typeof _views[viewName] === 'undefined') {
							e.preventDefault();
							
							bootnode.addClass('loading');

							appPath = viewName.split('/');
							
							_mod.dep.require([appPath[0] +'/view/'+ appPath[1] +'.ui'], function() {
								bootnode.removeClass('loading');
								_callEventListener(ev, target, false);
							});
						}
					} else if(typeof compName != 'undefined') {
						if(bootnode.attr('data-event') === eventName && typeof _comp[compName] === 'undefined') {
							_comp[compName] = true;
							
							bootnode.addClass('loading');
							_mod.dep.require(['comp/'+ compName], function() {
								bootnode.removeClass('loading');
								_callEventListener(ev, target, false);
							});
						}
					}
				}
			}
		},
		
		_initBootstrap = function() {
			for(var i = 0, len = _bootstrapEvents.length; i < len; i++) {
				_addEventListener(_bootstrapEvents[i]);
			}
		}
	;
	
	
	// DEBUG functions
	// --------------------
	_debug = function(scope) {
		return _mod.pipe.appBuilder('view', scope);
	};

	_debug.retrieve = function(scope, name) {
		return _views[scope + "/" + name];
	};
	
	_debug.list = function() {
		var list = {};
		for(var name in _views) {
			if(_views.hasOwnProperty(name)) {
				_mod.debug.log(_views[name].scope + ' / ' + name);
				if(typeof list[_views[name].scope] === 'undefined') {
					list[_views[name].scope] = [];
				}
				list[_views[name].scope].push(name);
			}
		}
		return list;
	};
	
	_debug.msg = function(viewName) {
		var 
			msgs = [],
			controllerEvents = _views[viewName].events.controller
		;
		for(var msg in controllerEvents) {
			if(controllerEvents.hasOwnProperty(msg)) {
				_mod.debug.log(msg);
				msgs.push(msg);
			}
		}
		return msgs;
	};
	
	_debug.man = function() {
		_mod.debug.log('Tetra.js ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
		_mod.debug.log('> View specs:');
		_mod.debug.log('		- notify app views as a controller		> tetra.debug.view(scope).notify(message, data)');
		_mod.debug.log('		- list all views and their scope		> tetra.debug.view.list()');
		_mod.debug.log('		- list all controller messages listened > tetra.debug.view.msg(viewName)');
		_mod.debug.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
		
		return true;
	};
	
	
	// Instantiation
	// --------------------
	var Builder = function(params) {
		var 
			me = this,
			has_ = (params.constr.length > 2)
		;
		
		if(_.toggleLib) _.toggleLib(has_);
		
		var
			app = _mod.pipe.appBuilder('controller', params.scope),
			constr = params.constr(this, app, _)
		;
		
		this.has_ = has_;
		this.scope = params.scope;
		this.root = params.root;
		this.events = constr.events;
		this.methods = constr.methods;
		this.listen = _customNonBubblingEventListener;
		
		return this;
	};
	
	
	// Registers a view when *all* its dependencies have been loaded.
	var _register =  function(viewName, params) {
		
		_views[viewName] = new Builder(params);			
		
		_mod.debug.log('view ' + viewName + ' : registered', _views[viewName].scope, 'info');
		
		var eventName;
		if(_views[viewName].events.user) {
			var userEvents = _views[viewName].events.user;
			for(eventName in userEvents) {
				if(userEvents.hasOwnProperty(eventName)) {
					_addEventListener(eventName, viewName);
					
					_mod.debug.log('view ' + viewName + ' : listening ' + eventName, _views[viewName].scope, 'info');
					if(eventName !== 'clickout') _listenedEvents[eventName].push(viewName);
				}
			}
		}
		
		if(_views[viewName].events.window) {
			var windowEvents = _views[viewName].events.window;
			for(eventName in windowEvents) {
				if(windowEvents.hasOwnProperty(eventName)) {
					if(typeof _windowEvents[eventName] === 'undefined') { 
						_windowEvents[eventName] = [];
					}
					
					_bindEvent(window, eventName, windowEvents[eventName]);
					
					_mod.debug.log('view ' + viewName + ' : listening ' + eventName, _views[viewName].scope, 'info');
					_windowEvents[eventName].push(viewName);
				}
			}
		}
		
		if(typeof _views[viewName].methods !== 'undefined' &&
				typeof _views[viewName].methods.init !== 'undefined') {
			if(!_conf.hasOwnProperty("disableViewInit") || !_conf.disableViewInit) {
				_views[viewName].methods.init();
			} 
		}
		
		return _views[viewName];
	};
	
	
	// Initialisation of environnement
	// --------------------
	
	// Verify whether the domLoaded event has been fired. Resolves an issue where models were not loaded as the
	// event had already been fired; we now instead check on the value of this boolean.
	if(_conf.env !== 'Node') {
		_(document).ready(function(){
			_conf.domLoaded = true;
		});
	}
	
	// Default Listeners
	if(_conf.enableBootstrap) {
		_initBootstrap();
	}
	
	
	// Interface implementation
	// --------------------
	return {
		
		register: function(name, params) {
			// Registers a view
			// Note that at a minimum a view must be given a name, and a params object literal with
			// the following structure
			//
			// {
			//	scope: 'theScope',
			//  constr: function(me, app) {
			//		return {
			//			events: {}
			//		};
			//  }
			// }
			
			var
				viewName = params.scope + '/' + name
			;
			
			if(!name || !params) {
				throw new Error(
						"tetra.view.register(name, params) : " + 
						"name and params are both required arguments");
			}
			
			if(!params.hasOwnProperty('scope') || !params.hasOwnProperty('constr')) {
				throw new Error(
						"tetra.view.register(name, params) : " + 
						"params must define a scope attribute and a constr method");
			}
			
			if(_views[viewName]) {
				throw new Error(
						"A view with the scope/name " + viewName + " already exists");
			}
			
			var deps = [];
			if(typeof params.use !== 'undefined') {
				for(var i = 0, len = params.use.length; i < len; i++) {
					deps.push(params.scope +'/controller/'+ params.use[i] +'.ctrl');
				}
			}
			
			_mod.dep.define(params.scope + '/view/' + name +'.ui', deps, function(require) {
				_register(viewName, params);
			});
			
			_mod.dep.require([params.scope + '/view/' + name +'.ui']);
		},
		
		destroy: function(name, scope) {
			var 
				viewName = scope + '/' + name,
				events,
				isBubbling,
				i,
				len
			;
			
			for(var eventName in _listenedEvents) {
				if(_listenedEvents.hasOwnProperty(eventName)) {
					events = _listenedEvents[eventName];
					
					isBubbling = true;
					if((typeof _nonBubblingEvents[eventName] !== 'undefined') &&
							(typeof _nonBubblingLimited[eventName] === 'undefined' || !_isBubblingSupported(eventName))) {
						isBubbling = false;
					}
						
					for(i = 0, len = events.length; i < len; i++) {
						if(events[i] === viewName) {
							if(!isBubbling) {
								_removeNonBubblingEventListener(eventName);
							}
							events.splice(i,1);
						}
					}
					
					if(!isBubbling && _listenedEvents[eventName].length === 0) { 
						delete _listenedEvents[eventName];
					}
				}
			}
			
			for(eventName in _windowEvents) {
				if(_windowEvents.hasOwnProperty(eventName)) {
					events = _windowEvents[eventName];
					for(i = 0, len = events.length; i < len; i++) {
						if(events[i] === viewName) {
							_unbindEvent(window, eventName, _views[viewName].events.window[eventName]);
							events.splice(i,1);
						}
					}
				}
			}
			
			_mod.dep.undef(scope + '/view/' + name +'.ui');
			
			delete _views[viewName];
		},
		
		// Notifies all views in the given scope with the message/data, as if we were a controller
		notify: function(message, data, scope) {
			var view, viewScope, viewController;
			
			for(var name in _views) {
				if(_views.hasOwnProperty(name)) {
					view = _views[name];
					viewScope = view.scope;
					
					if(view.events.controller) {
						viewController = view.events.controller;
							
						if(viewScope === scope &&
								typeof viewController !== 'undefined' && 
								typeof viewController[message] !== 'undefined') {
							
							_mod.debug.log('view ' + name + ' : exec ' + message, scope, 'info');
							
							if(_.toggleLib) _.toggleLib(view.has_);
							
							viewController[message](data, _mod.pipe.appBuilder('controller', scope));
						}
					}
				}
			}
		},
		
		debug: _debug
	};
});
// ------------------------------------------------------------------------------
// Tetra.js
// Native controller functions of Tetra.js
// ------------------------------------------------------------------------------
// Copyright (c) Viadeo/APVO Corp., Olivier Hory and other Tetra contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// ------------------------------------------------------------------------------
tetra.extend('controller', function(_conf, _mod, _) {
	
	var
		_controllers = {}, // controller objects
		_actions = {}, // actions for templating feature
		_debug
	;
	
	
	// DEBUG functions
	// --------------------
	_debug = {
		page: _mod.pipe.page,
		
		app: function(scope) {
			return _mod.pipe.appBuilder('controller', scope); 
		},
		
		list: function() {
			var list = {};
			for(var name in _controllers) {
				if(_controllers.hasOwnProperty(name)) {
					_mod.debug.log(_controllers[name].scope + ' / ' + name);
					if(typeof list[_controllers[name].scope] === 'undefined') {
						list[_controllers[name].scope] = [];
					}
					list[_controllers[name].scope].push(name);
				}
			}
			return list;
		},
		
		retrieve : function(scope, name) {
		    var ctrl = _controllers[scope + "/" + name];
		    if(ctrl) {
		        ctrl.actions = _actions[scope + "/" + name];
		    }

			return ctrl;
		},
		
		msg: function(ctrlName) {
			var 
				msgs = [],
				viewEvents
			;
			if(_controllers[ctrlName] && _controllers[ctrlName].events.view) {
				viewEvents = _controllers[ctrlName].events.view;
				for(var msg in viewEvents) {
					if(viewEvents.hasOwnProperty(msg)) {
						_mod.debug.log(msg);
						msgs.push(msg);
					}
				}
			} else {
				_mod.debug.log(ctrlName + ' was not found');
			}
			
			return msgs;
		},
		
		man : function() {
			_mod.debug.log('Tetra.js ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
			_mod.debug.log('> Controller specs:');
			_mod.debug.log('		- notify app controllers as a view		> tetra.debug.ctrl.app(scope).notify(message, data)');
			_mod.debug.log('		- notify all as a controller			> tetra.debug.ctrl.page.notify(message, data)');
			_mod.debug.log('		- list all controllers with their scope	> tetra.debug.ctrl.list()');
			_mod.debug.log('		- list all view messages listened		> tetra.debug.ctrl.msg(ctrlName)');
			_mod.debug.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
			
			return true;
		}
	};
	
	
	// Instantiation
	// --------------------
	var Builder = function(ctrlName, params) {
		var 
			me = this,
			app = _mod.pipe.appBuilder('view', params.scope),
			constr = params.constr(me, app, _mod.pipe.page, _mod.orm(params.scope))
		;
		
		this.scope = params.scope;
		this.events = constr.events;
		this.methods = constr.methods;
		
		_actions[ctrlName] = constr.actions;
		
		return this;
	};
	
	
	// Registers a controller when *all* its dependencies have been loaded.
	var _register = function(ctrlName, params) {
		_controllers[ctrlName] = new Builder(ctrlName, params);
		
		_mod.debug.log('controller ' + ctrlName + ' : registered', _controllers[ctrlName].scope, 'info');
		
		if(typeof _controllers[ctrlName].methods !== 'undefined' &&
				typeof _controllers[ctrlName].methods.init !== 'undefined') {
			_controllers[ctrlName].methods.init();
		}
		
		return _controllers[ctrlName];
	};
	
	
	// Interface implementation
	// --------------------
	return {
		// Registers a controller
		// Note that at a minimum a controller must be given a name, and a params object literal with
		// the following structure
		//
		// {
		//	scope: 'theScope',
		//  constr: function(me, app, page, orm) {
		//		return {
		//			events: {}
		//		};
		//  }
		// }
		register: function(name, params) {
			
			if(_conf.env === 'Node') params.scope = 'node';
			
			var
				ctrlName = params.scope + '/' + name
			;
			
			if(!name || !params) {
				throw new Error(
						"tetra.controller.register(name, params) : " + 
						"name and params are both required arguments");
			}
			
			if(!params.hasOwnProperty('scope') || !params.hasOwnProperty('constr')) {
				throw new Error(
						"tetra.controller.register(name, params) : " + 
						"params must define a scope attribute and a constr method");
			}

			if(_controllers[ctrlName]) {
				throw new Error(
						"A controller with the scope/name " + ctrlName + " already exists");
			}
			
			var deps = [], modelName;
			if(typeof params.use !== 'undefined') {
				for(var i = 0, len = params.use.length; i < len; i++) {
					modelName = params.use[i];
					if(modelName.substring(0,2) === 'g/') {
						modelName = modelName.substring(2);
						deps.push('g/model/'+ modelName +'.class');
					} else {
						deps.push(params.scope +'/model/'+ modelName +'.class');
					}
				}
			}
			
			_mod.dep.define(params.scope + '/controller/' + name +'.ctrl', deps, function() {
				_register(ctrlName, params);
			});
			
			_mod.dep.require([params.scope + '/controller/' + name +'.ctrl']);
		},
		
		destroy: function(name, scope) {
			var ctrlName = scope + '/' + name;
			
			_mod.dep.undef(scope + '/controller/' + name +'.ctrl');
			
			delete _controllers[ctrlName];
		},
		
		// Notification from views in the given scope
		notify: function(message, data, scope) {
			scope = scope || 'all';
			
			var ctrl, ctrlScope, ctrlView;
			
			for(var name in _controllers) {
				if(_controllers.hasOwnProperty(name)) {
					ctrl = _controllers[name];
					ctrlScope = ctrl.scope;
					
					if(ctrl.events.view) {
						ctrlView = ctrl.events.view;
	
						if((scope === 'all' || scope === ctrlScope) &&
								typeof ctrlView[message] !== 'undefined') {
							_mod.debug.log('ctrl ' + name + ' : exec ' + message, scope, 'info');
							ctrlView[message](data);
						}
					}
				}
			}
		},
		
		// Notification from models in the given scope
		modelNotify: function(modelName, type, args) {
			var thisCtrl;
			for(var ctrlName in _controllers) {
				if(_controllers.hasOwnProperty(ctrlName)) {
					thisCtrl = _controllers[ctrlName];
					if(thisCtrl.events && typeof thisCtrl.events.model !== 'undefined' &&
							typeof thisCtrl.events.model[modelName] !== 'undefined') {
						_mod.debug.log('ctrl ' + ctrlName + ' : model ' + modelName + ' ' + type, thisCtrl.scope, 'info');
						if(typeof thisCtrl.events.model[modelName][type] !== 'undefined') {
							thisCtrl.events.model[modelName][type].apply(thisCtrl, args);
						}
					}
				}
			}
		},
		
		exec: function(actionName, ctrlName, data, callback, scope, uid, cid) {
			var defaultTmpl;
			if(typeof ctrlName != 'string') {
				cid = uid;
				uid = scope;
				scope = callback;
				callback = data;
				data = ctrlName;
				ctrlName = undefined;
				
				defaultTmpl = actionName;
			} else {
				var ctrlId = scope + '/' + ctrlName;
				defaultTmpl = ctrlName + '/' + actionName;
			}
			
			var 
				_render = function(data, template) {
					if (!template) template = defaultTmpl;
					_mod.tmpl(template, data, callback, scope, uid, cid);
				},
				
				_execute = function() {
					if(ctrlId && _actions[ctrlId] && _actions[ctrlId][actionName]) {
						_actions[ctrlId][actionName](data, _render);
					} else {
						_render(data);
					}
				}
			;
			
			if(ctrlName) {
				_mod.dep.require([scope + '/controller/' + ctrlName +'.ctrl'], _execute);
			} else {
				_execute();
			}
		},
		
		debug: _debug
	};
});

// ------------------------------------------------------------------------------
// Tetra.js
// Native model functions of Tetra.js
// -------------------------------------------------------------------------------
// Copyright (c) Viadeo/APVO Corp., Olivier Hory and other Tetra contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// ------------------------------------------------------------------------------
tetra.extend('model', function(_conf, _mod, _) {
	
	var
		_models = {}, // model definitions
		_classes = {}, // model classes
		_debug
	;
	
	
	// ORM
	// Manage ajax requests and operations on objects
	// ------------------------------------------------------------------------------
	tetra.extend('orm', function(_conf, _mod, _) {
		
		// Caching module used in Node.js environnement
		if(typeof _mod.cache !== 'undefined') {
			var cache = _mod.cache;
		}
		
		// Special data management system for API or in Node.js environnement
		if(_conf.api) {
			_.initApi(_conf.api);
		} else if(_conf.mysql) {
			_.initMysql(_conf.mysql);
		}
		
		// ORM helpers
		var
			_isJSON = function(data) {
			    data = _.trim(data);
			    if(!data || data.length === 0) {
			        return false;
			    }
				return (/^[\],:{}\s]*$/
		                		.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
		                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
		                        .replace(/(?:^|:|,)(?:\s*\[)+/g, '')));
			},
			
			_successCbk = function(cbk) {
				return function(respObj) {
					if(typeof respObj === 'string') {
						if (_isJSON(respObj)) {
							respObj = JSON.parse(respObj);
						}
					}
					cbk(respObj);
				};
			},
			
			_errorCbk = function(cbk, cbk401) {
				return function(resp) {
					var respObj;
					if (_isJSON(resp.responseText)) {
						respObj = JSON.parse(resp.responseText);
					}
					cbk(resp.status, respObj ? respObj : {});
					
					if(resp.status === 401 || resp.status === 403) {
						cbk401(resp);
					}
				};
			}
		;
		
		// AJAX REQUESTER
		var _requester = (function() {
		
			var
				stack = [],
				requesting = false
			;
			
			var proceed = function() {
				if(!requesting && stack.length > 0) {
					_requester.request(stack[0].src, stack[0].url, stack[0].options);
					stack.shift();
				}
			};
		
			return {
				queue: function(src, url, options) {
					if(_conf.env === 'Node') {
						_requester.request(src, url, options);
					} else {
						stack.push({src: src, url: url, options: options});
						proceed();
					}
				},
				
				request: function(src, url, options){
					
					if(_.toggleLib) _.toggleLib(true);
					
					var defaultOptions = {};
					
					requesting = true;
					tetra.currentRequest = function(){
						_requester.queue(src, url, options);
						if(_conf.currentRequestCallback) {
							_conf.currentRequestCallback();
						}
					};
					
					if(_conf.env === 'Node' && _conf.api && _conf.api.access_token) {
						defaultOptions = {
							data : {
								access_token: _conf.api.access_token
							}
						};
					} else {
						defaultOptions = {
							processData: (options.headers['Content-Type'] && options.headers["Content-Type"].indexOf("application/json") === 0) ? false : true,
							create : function(req) {
								src.model.notify('call')({
									req: req,
									obj: src.obj ? src.obj : {}
								});
							},
							complete : function(req) {
								src.model.notify('complete')({
									req: req,
									obj: src.obj ? src.obj: {}
								});
								requesting = false;
								proceed();
							}
						};
					}
					
					if(typeof _conf.authCallback !== 'undefined') {
						defaultOptions.error401 = _conf.authCallback;
					}
					
					defaultOptions.success = _successCbk(options.success);
					defaultOptions.error = _errorCbk(options.error, defaultOptions.error401);
					
					if(src.model.type === 'ajax') {
						return _.ajax(url, _.extend(options, defaultOptions));
					} else if(src.model.type === 'api') {
						return _.api(url, _.extend(options, defaultOptions));
					} else if(src.model.type === 'mysql') {
						return _.mysql(url, _.extend(options, defaultOptions));
					}
					
					return false;
				}
			};
		})();
		
		return function(scope) {
			
			return function(name) {
				
				var
					model = _models[scope +'/'+ name] || _models['g/'+ name]
				;
				
				var			
					_create = function(attributes, skipValid, skipCache) {
						var classes = _classes[scope +'/'+ name] || _classes['g/' + name];
						var obj = new classes();
						obj.update(attributes, skipValid);
						
						model.objects[obj.get('ref')] = obj;
						if((obj.get('id') !== 0) && (obj.get('id') != '0020')) {
							model.ids[obj.get('id')] = obj.get('ref');
						
							if(cache && (typeof skipCache === 'undefined' || (typeof skipCache !== 'undefined' && !skipCache))) {
								var cacheKey = 'NODE:' + scope +'-'+ name + '-id-' + obj.get('id');
								cache.set(cacheKey, attributes, _conf.cacheTimeout, function(err, data) {
									if(_conf.env === 'Node') _mod.debug.log('ORM: SAVE: store "' + cacheKey + '"', 'all', 'log', attributes);
								});
							}
						}
	
						_mod.debug.log('model ' + scope +'/'+ name + ' : object ' + obj.get('ref') + ' created', 'all', 'info');
						
						_notify('create')(obj);
						return obj;
					},
					
					// Saves the object to the server
					_save = function(attributes) {
						
						var
							id = attributes.id,
							obj = model.objects[attributes.ref]
						;
						
						// Directly notify controllers
						_notify('update')(obj);
						
						_requester.queue({model:this, obj:obj}, _buildUrl(model.req.save, attributes), {
							type : model.req.save.method,
							headers : model.req.save.headers,
							data : _buildData(model.req.save, attributes),
							success : function(respObj){
								
								// A successful save response should have the following format: 
								// 
								//	{
								//		status: "SUCCESS",
								//		data: {
								//			59: {"id": 59, ...}
								//		}
								//	}
								//
								// In the case of a problem other than a server error/404, the correct response
								// format is as below. The alerts object should contain the list of attributes that have provoked
								// the fail, along with an associated error message:
								//
								//	{
								//		status: "FAIL",
								//		data: {
								//			59: {"id": 59, ...}
								//		},
								//		alerts: {
								//	  	"attr1": "alert message 1",
								//	  	"attr2": "alert message 2"
								//		}
								//	}
	
								// An empty or undefined response is valid for a SAVE
								respObj = respObj || {};
								
								if(typeof respObj === 'string') {
									respObj = {
										status: 'SUCCESS', 
										data: {
											"0": {
												html: respObj
											}
										}
									};
								}
	
								if(respObj.status === 'FAIL') {
									_notify('alert')({
										type: 'save',
										alerts: respObj.alerts ? respObj.alerts : {}, obj: obj
									}, respObj);
								} else {
									if(typeof respObj.data !== 'undefined') {
										
										// Get object
										for(var objId in respObj.data) { break; }
										
										if(typeof objId !== 'undefined') {
											
											// Manage object creation case
											// TODO Viadeo specific thing here
											if(id === 0 || id === '0020') {
												// Clean model cache
												model.cache = {};
	
												// Update object id
												obj.set('id', objId);
												model.ids[obj.get('id')] = obj.get('ref');
												
												if(cache) {
													attributes.id = objId;
													var cacheKey = 'NODE:' + scope +'-'+ name + '-id-' + obj.get('id');
													cache.set(cacheKey, attributes, _conf.cacheTimeout, function(err, data) {
														if(_conf.env === 'Node') _mod.debug.log('ORM: SAVE: store "' + cacheKey + '"', 'all', 'log', attributes);
													});
												}
											}
											
											// Update object and confirm creation
											obj.update(respObj.data[objId]);
										}
									}
									_notify('stored')(obj, respObj);
								}
							},
							error : function(code, respObj) {
								// A server error response should ideally have the following format:
								// 
								//	{
								//		status: "FAIL",
								//		errors: [
								//		"error message x",
								//		"error message y"
								//		]
								//	}
								_notify('error')({
									type: 'save',
									errorCode: code,
									errors: respObj.errors ? respObj.errors : [],
									obj: obj
								}, respObj);
								obj.revert();
							}
						});
					},
					
					_fetch = function(cond, success, that) {
						var uriParams = cond.uriParams;
						_requester.queue({model:(that)?that:this}, _buildUrl(model.req.fetch, cond), {
							type : model.req.fetch.method,
							headers : model.req.fetch.headers,
							data : _buildData(model.req.fetch, cond),
							success : function(respObj){
								//	{
								//		status: "SUCCESS",
								//		data: {
								//			4: {},
								//			9: {},
								//			37: {}
								//		},
								//		count: 3
								//	}
								//
								// or manage custom format using model.req.fetch.parser(resp, col) in your class definition
								
								// Build result collection
								if(respObj && (!respObj.status || respObj.status !== "FAIL")) {
									var 
										ids = [],
										col = [], 
										data
									;
									
									if(typeof model.req.fetch.parser !== 'undefined') {
										if(uriParams) cond.uriParams = uriParams;
										data = model.req.fetch.parser(respObj, {}, cond);
										respObj = {data: data, count:(respObj && respObj.count) ? respObj.count : 0};
									} else if(model.req.type === 'mysql') {
										var i = 0;
										data = {};
										for(; i < respObj.length; i++) {
											data[respObj[i][model.req.dbTable.id]] = respObj[i];
										}
										respObj = {data: data};
									}
									for(var id in respObj.data) {
										if(respObj.data.hasOwnProperty(id)) {
											ids.push(id);
											respObj.data[id].id = id;
											col.push(_create(respObj.data[id]));
										}
									}
									
									/* Store id list in cache */
									if(_conf.env === 'Node') delete cond.access_token;
									cond.uriParams = uriParams;
									var condSign = JSON.stringify(cond);
									
									if(_conf.env === 'Node') _mod.debug.log('ORM: FETCH ' + scope +'/'+ name + ' with cond: ' + condSign, 'all', 'log');
	
									if(cache) {
										var cacheKey = 'NODE:' + scope +'-'+ name + '-req-' + condSign;
										cache.set(cacheKey, ids, _conf.cacheTimeout, function(err, data) {
											if(_conf.env === 'Node') _mod.debug.log('ORM: FETCH: store "' + cacheKey + '"', 'all', 'log', ids);
										});
									} else {
										model.cache[condSign] = ids;
									}
								
									// Store meta data in model
									if(typeof respObj !== "string") {
										for(var key in respObj) {
											if(respObj.hasOwnProperty(key)) {
												if(key !== 'status' && key !== 'data' &&
														key !== 'alerts' && key !== 'errors') {
													model.meta[key] = respObj[key];
												}
											}
										}
									}
									
									if(typeof success !== 'undefined') {
										success(col);
									} else {
										_notify('append')(col);
									}
								} else {
									cond.uriParams = uriParams;
									_notify('alert')({
										type: 'fetch',
										alerts: respObj && respObj.alerts ? respObj.alerts : {},
										cond: cond
									}, respObj);
								}
							},
							error : function(code, respObj) {
								//  {
								//		status: "FAIL",
								//		errors: [
								//			"error message x",
								//			"error message y"
								//		]
								//  }
								cond.uriParams = uriParams;
								_notify('error')({
									type: 'fetch',
									errorCode: code,
									errors: respObj && respObj.errors ? respObj.errors : [],
									cond: cond
								}, respObj);
							}
						});
					},
					
					// Retrieve an object by its id (returned by the server). Note that you must chain a call
					// to _find to a success callback
					_find = function(id) {
						if(typeof model.ids[id] === 'undefined') {
							var that = this;
							return {
								success: function(fct) { 
									_fetch({id: id}, (fct) ? function(col){ fct(col[0]); } : undefined, that); 
								}
							};
						} else {
							return {
								success: function(fct) {
									fct(model.objects[model.ids[id]]);
								}
							};
						}
					},
					
					// Retrieve an object by its reference (generated by tetra.js). Will return the object, so no need
					// for a success callback
					_findByRef = function(ref) {
						return model.objects[ref] || null;
					},
					
					// Retrieve a local object by passing in a cond object
					// that represents the expected structure and values of the
					// object in question. Again, should chain to a success callback
					_findByCond = function(cond) {
						var 
							col = [],
							objs = model.objects,
							match
						;
						for(var ref in objs) {
							if(objs.hasOwnProperty(ref)) {
								match = true;
								for(var key in cond) {
									if(cond.hasOwnProperty(key)) {
										if(objs[ref].get(key) != cond[key]) {
											match = false;
											break;
										}
									}
								}
								if(match) {
									col.push(objs[ref]);
								}
							}
						}
						return {
							success: function(fct) {
								if(col.length <= 1) {
									fct(col[0] || null);
								} else {
									fct(col);
								}
							}
						};
					},
					
					_select = function(cond) {
						// Manage parameters order to get the same signature of the request
						if(cond.uriParams) {
							var uriParams = cond.uriParams;
							delete cond.uriParams;
							cond.uriParams = uriParams;
						}
						
						var
							condSign = JSON.stringify(cond)
						;
						
						if(_conf.env === 'Node') _mod.debug.log('ORM: SELECT ' + scope +'/'+ name + ' with cond: ' + condSign, 'all', 'log');
	
						var that = this;
						return {
							success: function(fct) {
								if(cache) {
									var cacheKey = 'NODE:' + scope +'-'+ name + '-req-' + condSign;
									cache.get(cacheKey, function(err, data) {
										if(_conf.env === 'Node') _mod.debug.log('ORM: SELECT: retrieve "' + cacheKey + '"', 'all', 'log', data);
										_selectCbk(cond, data, fct, that);
									});
								} else {
									_selectCbk(cond, model.cache[condSign], fct, that);
								}
							}
						};
					},
	
					_selectCbk = function(cond, cachedList, fct, that) {
						if(!cachedList) {
							if(_conf.env === 'Node') _mod.debug.log('ORM: SELECT: data retrieved from server', 'all', 'log');
	
							/* Request server to get data */
							_fetch(cond,(fct)? function(col){fct(col);} : undefined, that);
							
						} else {
							if(_conf.env === 'Node') _mod.debug.log('ORM: SELECT: data retrieved from cache:', 'all', 'log', cachedList);
	
							// Build result collection
							var
								col = [],
								i = 0,
								len = cachedList.length,
								keys = []
							;
							
							if(len === 0 || !cache) {
								for(i = 0; i < len; i++) {
									col.push(model.objects[model.ids[cachedList[i]]]);
								}
								if(fct) {
									fct(col);
								} else {
									_notify('append')(col);
								}
							} else {
								for(i = 0; i < len; i++) {
									keys.push('NODE:' + scope +'-'+ name + '-id-' + cachedList[i]);
								}
								cache.get(keys, function(err, data) {
									var
										col = [],
										i
									;							
									for(i in data) {
										col.push(_create(data[i], false, true));
									}
									
									if(fct) {
										fct(col);
									} else {
										_notify('append')(col);
									}
								});
							}
						}
					},
					
					_del = function(ref, attr) {
						
						var obj = model.objects[ref];
						_notify('remove')(obj);
						
						if(typeof attr === 'undefined') {
							attr = {id: obj.get('id')};
						}
						
						_requester.queue({model:this}, _buildUrl(model.req.del, attr), {
							type : model.req.del.method,
							headers : model.req.del.headers,
							data : _buildData(model.req.del, attr),
							success : function(respObj){
								
								//	{
								//		status: "SUCCESS"
								//	}
								//
								// or
								//
								//	{
								//		status: "FAIL",
								//		alerts: {
								//			"attr1": "alert message 1",
								//			"attr2": "alert message 2"
								//		}
								//	}
								
								// An empty or undefined response is valid for a delete
								respObj = respObj || {};
								
								if(respObj.status === 'SUCCESS' || typeof respObj.status === 'undefined') {
									// confirm deletion
									_notify('deleted')(obj, respObj);
									
									// delete object in cache
									delete model.ids[obj.get('id')];
									delete model.objects[ref];
									if(cache) {
										var cacheKey = 'NODE:' + scope +'-'+ name + '-id-' + obj.get('id');
										cache.del(cacheKey, function(err, data) {
											if(_conf.env === 'Node') _mod.debug.log('ORM: DEL: delete "' + cacheKey + '"', 'all', 'log', data);
										});
									}
								} else {
									_notify('alert')({
										type: 'delete',
										alerts: respObj.alerts ? respObj.alerts : {},
										obj: obj
									}, respObj);
								}
							},
							error : function(code, respObj) {
								//	{
								//		status: "FAIL",
								//		errors: [
								//	   	 "error message x",
								//			"error message y"
								//		]
								//	}
								_notify('error')({
									type: 'delete',
									errorCode: code,
									errors: respObj.errors ? respObj.errors : [],
									obj: obj
								}, respObj);
								
								// delete object in cache
								delete model.ids[obj.get('id')];
								delete model.objects[ref];
							}
						});
					},
					
					_notify = function(type) {
						
						return function() {
							_mod.debug.log('model ' + scope +'/'+ name + ' : ' + type, 'all', 'log', arguments[0]);
							tetra.controller.modelNotify(name, type, arguments);
						};
					},
					
					_reset = function(cond){
						_notify('reset')(model.objects);
						model.ids = {};
						model.objects = {};
						
						_requester.queue({model:this}, _buildUrl(model.req.reset, cond), {
							type : model.req.reset.method,
							headers : model.req.reset.headers,
							data : _buildData(model.req.reset, cond),
							success : function(respObj){
							
								// An empty or undefined response is valid for a reset
								respObj = respObj || {};
								
								if(respObj.status && respObj.status === "FAIL") {
									_notify('alert')({
										type: 'reset',
										alerts: respObj.alerts ? respObj.alerts : {}
									}, respObj);
								} else {
									_notify('resetted')(name, respObj);
								}
							},
							error : function(code, respObj) {
								//	{
								//		status: "FAIL",
								//		errors: [
								//			"error message x",
								//	   	 "error message y"
								//		]
								//	}
	
								_notify('error')({
									type: 'reset', 
									errorCode: code, 
									errors: respObj.errors ? respObj.errors : [],
									data: cond
								}, respObj);
							}
						});
					},
					
					_length = function() {
						var 
							count = 0,
							objs = model.objects
						;
						for(var key in objs) {
							if(objs.hasOwnProperty(key)) {
								count++;
							}
						}
						return count;
					},
					
					_getMeta = function(name) {
						return model.meta[name];
					},
					
					// Builds a URL for an ORM request. Pass true as the final parameter to omit the timestamp
					// (though I'm not sure how this will yet be exposed in a useful way)
					_buildUrl = function(reqObj, cond, omitTimestamp) {
						var
							url = reqObj.url,
							now
						;
						
						if(model.req.type === 'mysql') {
							return model.req.dbTable;
						}
						
						if(typeof reqObj.uriParams !== 'undefined') {
							for(var i = 0, len = reqObj.uriParams.length; i < len; i++) {
								if(typeof cond[reqObj.uriParams[i]] !== 'undefined') {
									url = url.replace('{'+i+'}', cond[reqObj.uriParams[i]]);
								} else {
									url = url.replace('{'+i+'}', cond.uriParams[reqObj.uriParams[i]]);
								}
							}
							if(typeof cond.uriParams !== 'undefined') {
								delete cond.uriParams;
							}
						}
						
						if(!omitTimestamp) {
							now = new Date();
							if(url.indexOf('?') < 0) {
								url += '?ts=' + now.getTime();
							} else {
								url += '&ts=' + now.getTime();
							}
						}
						
						return url;
					},
					
					_buildData = function(reqObj, params) {
						if(reqObj.headers["Content-Type"] && reqObj.headers["Content-Type"].indexOf("application/json") === 0) {
							return JSON.stringify(_.extend(params, reqObj.params));
						} else {
							return _.extend(params, reqObj.params);
						}
					}
				;
				
				return {
					type: model.req.type,
					create: function(attr) {
						return _create(attr, true);
					},
					save: _save,
					fetch: _fetch,
					find: _find,
					findByRef: _findByRef,
					findByCond: _findByCond,
					select: _select,
					del: _del,
					reset: _reset,
					notify: _notify,
					length: (function(){return _length();})(),
					getMeta: _getMeta
				};
			};
		};
	});
	
	
	// DEBUG functions
	// --------------------
	_debug = function(scope, name) {
		return _mod.orm(scope)(name);
	};
	
	_debug.list = function() {
		var list = [], name;
		for(name in _models) {
			if(_models.hasOwnProperty(name)) {
				_mod.debug.log(name);
				list.push(name);
			}
		}
		return list;
	};
			
	_debug.retrieve = function(scope, name) {
		return _models[scope +'/'+ name];
	};
	
	_debug.man = function() {
		_mod.debug.log('Tetra.js ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
		_mod.debug.log('> Model specs:');
		_mod.debug.log('		- retrieve an object and its ref		> tetra.debug.model(modelName).findByRef(ref)');
		_mod.debug.log('		- notify all controllers as a model		> tetra.debug.model(modelName).notify(type)(data)');
		_mod.debug.log('			  * types : call, complete, append, create, stored, update, delete, error');
		_mod.debug.log('		- list all models						> tetra.debug.model.list()');
		_mod.debug.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
		
		return true;
	};
	
	
	// Constructor of the class for the model
	// --------------------
	var Builder = function(name, params) {
		
		var 
			modelName = name,
			modelScope = params.scope,
			modelAttr = params.attr,
			modelMethods = params.methods
		;
		
		return function() {
			
			var attr = _.extend({
					ref: 0,
					id: 0
				}, modelAttr);
			
			var bckAttr = {};
			for(var a in attr) {
				if(attr.hasOwnProperty(a)) {
					bckAttr[a] = attr[a];
				}
			}
			
			var methods = _.extend({
				
				// Retrieve an attribute from an object as described by the model
				get: function(attrName) {
					return attr[attrName];
				},
				
				// Set the value of an attribute
				set: function(attrName, value) {
					bckAttr[attrName] = attr[attrName];
					if(typeof attr[attrName] !== 'undefined') {
						attr[attrName] = value;
					}
					return this;
				},
				
				// Modify the values of multiple attributes at once
				update: function(attributes, skipValid) {
					if(skipValid || validAttr(attributes, this)) {
						for(var attrName in attributes) {
							this.set(attrName, attributes[attrName]);
						}
					   
						return this;
					} else {
						return {save:function(){}};
					}					  
				},
				
				// Revert the values of all object attributes to their original values
				revert: function() {
					attr = bckAttr;
				},
				
				// Save the object to the server. Will call the ORM.
				save: function(params) {
					if(validAttr(attr, this)) {
						_mod.orm(modelScope)(modelName).save(_.extend(attr, params)); // REFACTOR !
						return attr.id;
					} else {
						return false;
					}
				},
				
				// Delete the object from the server. Will call the ORM.
				remove: function(params) {
					_mod.orm(modelScope)(modelName).del(attr.ref, _.extend(attr, params)); // REFACTOR !
				}
			}, modelMethods(attr));
			
			var genRef = function() {
				attr.ref = (new Date()).getTime() + '-' + Math.ceil(Math.random()*1001);
				methods.ref = attr.ref;
			};
			
			var validAttr = function(attributes, obj) {
				var errors = [];
				
				if(typeof methods.validate !== 'undefined') {
					var curAttr = {};
					for(var attrName in attr) {
						if(attr.hasOwnProperty(attrName)) {
							if(typeof attributes[attrName] !== 'undefined') {
								curAttr[attrName] = attributes[attrName];
							}
							else {
								curAttr[attrName] = attr[attrName];
							}
						}
					}
					
					errors = methods.validate(curAttr, errors);
				
					if(errors.length > 0) {
						tetra.controller.modelNotify(modelName, 'invalid', [{attr: errors, obj: obj}]);
						return false;
					} 
				}
				
				return true;
			};
			
			genRef();
			if(typeof methods.init === 'function') {
				methods.init();
			}
			
			return methods;
		};
	};
	
	
	// Instantiation of an object of the model
	// --------------------
	var oModel = function(name, params) {
		
		if(typeof params.req === 'undefined') {
			params.req = {};
		}
		
		var defObj = _.extend({
				objects: {},
				ids: {},
				cache: {},
				meta: {}
			}, params);

		if(typeof defObj.req.type === 'undefined') {
			defObj.req.type = 'ajax';
		}
		
		defObj.req.fetch = _.extend({
			url : _conf.FETCH_URL.replace('{name}', name),
			method : _conf.FETCH_METHOD,
			headers : {},
			params : {}
		}, params.req.fetch);
		
		defObj.req.save = _.extend({
			url : _conf.SAVE_URL.replace('{name}', name),
			method : _conf.SAVE_METHOD,
			headers : {},
			params : {}
		}, params.req.save);
		
		defObj.req.del = _.extend({
			url : _conf.DEL_URL.replace('{name}', name),
			method : _conf.DEL_METHOD,
			headers : {},
			params : {}
		}, params.req.del);
		
		defObj.req.reset = _.extend({
			url : _conf.RESET_URL.replace('{name}', name),
			method : _conf.RESET_METHOD,
			headers : {},
			params : {}
		}, params.req.reset);
		
		for(var reqType in defObj.req) {
			if(defObj.req.hasOwnProperty(reqType)) {
				var reqObj = defObj.req[reqType];
				if(reqObj.hasOwnProperty('headers')) {
					if(reqObj.headers["Content-type"]) {
						reqObj.headers["Content-Type"] = reqObj.headers["Content-type"];
						delete reqObj.headers["Content-type"];
					}
					if(reqObj.headers["Content-Type"] && !/charset/.test(reqObj.headers["Content-Type"])) {
						reqObj.headers["Content-Type"] = reqObj.headers["Content-Type"] + ";charset=utf-8";
					}
					if(!reqObj.headers.Accept) {
						reqObj.headers.Accept = "*/*";
					}
				}
			}
		}
		
		// Block anything other than POST/PUT for Save operations
		var saveMethod = params.req.save.method.toUpperCase();
		if(saveMethod !== "POST" && saveMethod !== "PUT") {
			throw new Error("A 'save' can only be performed using POST or PUT");
		}
		
		// Block anything other than POST/DELETE for Delete operations
		var delMethod = params.req.del.method.toUpperCase();
		if(delMethod !== "POST" && delMethod !== "DELETE") {
			throw new Error("A 'delete' can only be performed using POST or DELETE");
		}
		
		// Block anything other than POST/PUT for Reset operations
		var resetMethod = params.req.reset.method.toUpperCase();
		if(resetMethod !== "PUT" && resetMethod !== "POST") {
			throw new Error("A 'reset' can only be performed using PUT or POST");
		}
		
		return defObj;
	};
	
	
	// Interface implementation
	// --------------------
	return {
		// Registers a model.
		// Note that, at the minimum, the model must be given a name and an empty params object literal 
		register: function(name, params) {
			params = params || {};
			if(_conf.env === 'Node') params.scope = 'node';
			if(!params.scope) params.scope = 'g';

			var
				modelName = params.scope + '/' + name
			;
			
			if(!name) {
				throw new Error(
						"tetra.model.register(name, params) : " + 
						"Name is a required argument");
			}
			
			if(_models[modelName] || _models['g/' + name]) {
				throw new Error(
						"A model with the name " + name + " already exists");
			}
			
			_mod.dep.define(params.scope +'/model/'+ name +'.class', function() {
				
				_models[modelName] = oModel(name, params);
				
				_mod.debug.log('model ' + modelName + ' : registered', 'all', 'info');
				
				_classes[modelName] = new Builder(name, params);
				
				_mod.debug.log('model ' + modelName + ' : associated class generated', 'all', 'info');
				
				return _models[modelName];
			});
			
			_mod.dep.require([params.scope +'/model/'+ name +'.class']);
		},
		
		destroy: function(name, scope) {
			if(!scope) {scope = 'g';}
			var modelName = scope + '/' + name;
			
			_mod.dep.undef(scope +'/model/'+ name +'.class');
			
			delete _models[modelName];
		},
		
		debug: _debug
	};
});