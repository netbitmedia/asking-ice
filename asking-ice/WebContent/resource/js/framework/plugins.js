/**
 * PluginManager. Manages all registered plugins
 * @augments Class
 * @author griever
 */
PluginManager = Class.extend({
	
	/**
	 * Initialize fields
	 * @constructor
	 */
	init: function()	{
		if(PluginManager.singleton == undefined){
			throw "Singleton class, can not be directly created !";
			return undefined;
		}
		var subject = SingletonFactory.getInstance(Subject);
		subject.attachObserver(this);
		this.plugins = Array();
	},
	
	/**
	 * Add plugin to the manager
	 * @function
	 * @param {plugin} the plugin to be added
	 * @param {delay} whether the plugin should be loaded after added
	 */
	addPlugin: function(plugin, delay)	{
		var pluginMeta = {};
		if (delay != true)
			plugin.onLoad();
		this.plugins.push(plugin);
	},
	
	/**
	 * Remove plugin at the specified index
	 * @function
	 * @param {index} the index of the plugin to be removed
	 */
	removePlugin: function(index)	{
		var plugin = this.plugins[index];
		if (plugin != undefined)	{
			plugin.onUnload();
			this.plugins.splice(index, 1);
		}
	},
	
	/**
	 * Get all plugins
	 * @function
	 * @returns {Array} the current plugins
	 */
	getPlugins: function()	{
		return this.plugins;
	},
	
	/**
	 * Remove every plugins managed by this manager
	 * @function
	 */
	removeAllPlugins: function()	{
		for(var i=0;i<this.plugins.length;i++)	{
			var plugin = this.plugins[i];
			if (plugin.isLoaded())	{
				plugin.onUnload();
			}
		}
		this.plugins = Array();
	},
	
	/**
	 * Event hook. Triggered by the Subject and in turn triggers all plugins that it manages
	 * @function
	 * @param {eventName} the event name
	 * @param {eventData} the event data
	 */
	notify: function(eventName, eventData)	{
		for(var i=0;i<this.plugins.length;i++)	{
			var plugin = this.plugins[i];
			if (plugin.isLoaded())	{
				var methodName = "on"+eventName;
				if (typeof plugin[methodName] != 'undefined')	{
					var method = plugin[methodName];
					method.call(plugin, eventData);
				}
			}
		}
	}
}).implement(ObserverInterface);

/**
 * The plugin interface.
 * Provide the following methods:
 *  - isLoaded(): check if the plugin is loaded
 *  - getName(): get the plugin's name
 *  - onLoad(): called when the plugin is loaded
 *  - onBegin(): called when the plugin begins its routine
 *  - onEnd(): called when the plugin ends its routine
 *  - onUnload(): called when the plugin is unloaded from memory
 * @augments InterfaceImplementor
 * @author griever
 */
PluginInterface = InterfaceImplementor.extend({
	implement: function(obj)	{

		obj.prototype.isLoaded = obj.prototype.isLoaded || function()	{
			if (this.loaded == undefined)
				this.loaded = false;
			return this.loaded;
		};
		
		obj.prototype.getName = obj.prototype.getName || function()	{
			return this.name;
		};
		
		obj.prototype.onLoad = obj.prototype.onLoad || function()	{
			this.loaded = true;
			this.onBegin();
		};
		
		obj.prototype.onBegin = obj.prototype.onBegin || function() {};
		
		obj.prototype.onEnd = obj.prototype.onEnd || function() {};
		
		obj.prototype.onUnload = obj.prototype.onUnload || function()	{
			this.loaded = false;
			this.onEnd();
		};
		
		//super interfaces
		new ObserverInterface().implement(obj);
	}
});

/**
 * Interval timer interface. Used for circular portlets or plugins
 * Provide the following methods:
 *  - startInterval(interval, callback): start the interval timer
 *  - stopInterval(): stop the interval timer
 *  @augments InterfaceImplementor
 *  @author griever
 */
IntervalTimerInterface = InterfaceImplementor.extend({
	implement: function(obj)	{
		obj.prototype.startInterval = obj.prototype.startInterval || function(interval, callback)	{
			//stop previous interval timer if any
			if (this.intervalSetup == true)	{
				this.stopInterval();
			}
			this.intervalSetup = true;
			var _this = this;
			this.currentIntervalID = setInterval(function() {callback.call(_this);}, interval);
		};
		
		obj.prototype.stopInterval = obj.prototype.stopInterval || function()	{
			if (this.currentIntervalID != undefined)
				clearInterval(this.currentIntervalID);
			else	{
				//console.warn('bug! currentIntervalID not defined');
			}
		};
	}
});