/**
 * A class to store system-wide properties
 * @augments Class
 * @author griever
 */
SystemProperty = Class.extend({
	
	/**
	 * Initialize properties
	 * @constructors
	 */
	init: function()	{
		this.properties = Array();
	},
	
	/**
	 * Retrieve the value of a property
	 * @function
	 * @param {property} the name of the property to retrieve
	 * @param {defaultValue} the default value, used if the property is not found
	 * @returns {mixed} the property value, or the default value or undefined 
	 */
	get: function(property, defaultValue)	{
		var cookieValue = $.cookie(property);
		if(cookieValue != undefined){
			return cookieValue;
		}else if(this.properties[property] != undefined){
			return this.properties[property];
		}else {
			return defaultValue;
		}
	},
	
	/**
	 * Store the value of a property
	 * @function
	 * @param {property} the name of the property to store
	 * @param {value} the new value
	 * @param {persistent} should the property be stored in cookie for future use
	 */
	set: function(property, value, persistent)	{
		if(!persistent){
			this.properties[property] = value;
		}else{
			$.cookie(property,value,{ expires: 1 });
		}
//		console.log('system property changed: '+property);
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent("SystemPropertyChanged", property);
	},
	
	dump: function()	{
		//console.log('Dumping system properties...');
		for(var p in this.properties)	{
			//console.log(p+": "+this.properties[p]);
		}
		//console.log('Dumping complete!');
	}
});

/**
 * Resource Manager. Manage resource using the underlying resource locator
 * @augments Class
 * @author griever
 */
ResourceManager = Class.extend({
	
	/**
	 * Initialize resource locators
	 * @constructors
	 */
	init: function()	{
		this.resourceLocator = new JQueryResourceLocator();
	},
	
	/**
	 * Change the current resource locator
	 * @param {locator} the resource locator to be used
	 */
	setResourceLocator: function(locator)	{
		this.resourceLocator = locator;
	},
	
	/**
	 * Get the current resource locator
	 * @returns {ResourceLocator} the current resource locator
	 */
	getResourceLocator: function(locator)	{
		return this.resourceLocator;
	},
	
	/**
	 * Ask the underlying resource locator for a specific resource
	 * @param {type} used as a namespace to distinct different resources with the same name
	 * @param {name} the name of the resource
	 * @param {resourceLocator} Optional. The resource locator to be used in the current request
	 */
	requestForResource: function(type, name, resourceLocator)	{
		var id = type+"-"+name;
		if (resourceLocator != undefined)	{
			return resourceLocator.locateResource(id);
		}
		return this.resourceLocator.locateResource(id);
	},
	
	/**
	 * Ask the underlying resource locator for a custom resource
	 * @param {customSelector} the selector used to retrieve the resource, depending on underlying the resource locator
	 * @param {resourceLocator} Optional. The resource locator to be used in the current request
	 */
	requestForCustomResource: function(customSelector, resourceLocator)	{
		if (resourceLocator != undefined)	{
			return resourceLocator.locateResource(customSelector);
		}
		return this.resourceLocator.locateCustomResource(customSelector);
	}
});

/**
 * ResourceLocator. Locate resource
 * @augments Class
 * @author griever
 */
ResourceLocator = Class.extend({
	/**
	 * Locate a resource based on its ID
	 * By default, this function do nothing
	 */
	locateResource: function(resourceID)	{
		
	}
});

/**
 * JQuery Resource Locator. Locate resource using DOM
 * @augments ResourceLocator
 * @author griever
 */
JQueryResourceLocator = ResourceLocator.extend({
	
	/**
	 * Locate resource based on its ID
	 * @param {id} the resource ID
	 * @returns {mixed} the resource or undefined
	 */
	locateResource: function(id)	{
		if ($('#'+id).length > 0)	{
			return $('#'+id);
		}
		return undefined;
	},
	
	/**
	 * Locate resource based on the custom selector
	 * @param {custom} the custom selector
	 * @returns {mixed} the resource or undefined
	 */
	locateCustomResource: function(custom)	{
		if ($(custom).length > 0)	{
			return $(custom);
		}
		return undefined;
	}
});

//JQuery Horizontal alignment plugin
(function ($) { $.fn.vAlign = function() { return this.each(function(i){ var h = $(this).height(); var oh = $(this).outerHeight(); var mt = (h + (oh - h)) / 2; $(this).css("margin-top", "-" + mt + "px"); $(this).css("top", "50%"); $(this).css("position", "absolute"); }); }; })(jQuery); (function ($) { $.fn.hAlign = function() { return this.each(function(i){ var w = $(this).width(); var ow = $(this).outerWidth(); var ml = (w + (ow - w)) / 2; $(this).css("margin-left", "-" + ml + "px"); $(this).css("left", "50%"); $(this).css("position", "absolute"); }); }; })(jQuery);

/**
 * Manage a set of objects
 * @augments Class
 * @author griever
 */
ObjectManager = Class.extend({
	
	/**
	 * Initialize fields
	 * @constructor
	 */
	init: function()	{
		this.objects = new Array();
		this.context = null;
		this.mainObjects = new Array();
	},

	/**
	 * Register an object to be managed by this
	 * @function
	 * @param {obj} the object to register
	 */
	register: function(obj)	{
		this.objects.push(obj);
	},
	
	/**
	 * Register a context
	 * @function
	 * @param {obj} the context to register
	 */
	registerContext: function(obj)	{
		this.context = obj;
	},
	
	/**
	 * main object is one visualize the idea, a main object usually is a collection of main image
	 * and other thing support for the display
	 * @function
	 * @param {obj} the main object
	 */
	registerMainObjects: function(obj)	{
		this.mainObjects.push(obj);
	},
	
	/**
	 * Retrieve the main objects
	 * @function
	 * @returns {mixed} the main objects
	 */
	getMainObjects: function(){
		return this.mainObjects;
	},

	/**
	 * Remove object from the list
	 * @function
	 * @param {obj} the object to be removed
	 */
	remove: function(obj)	{
		/*
		* remove from display
		*/
		var i = this.findIndex(obj.id);
		if (i != -1)	{
			this.objects.splice(i, 1);
		}
		/*
		* remove from mainObjects array
		*/
		for(var j=0;j<this.mainObjects.length;j++)	{
			if(obj.id == this.mainObjects[j].id)		{
				this.mainObjects.splice(j,1);
			}
		}
	},
	
	/**
	 * Find an object using its ID
	 * @function
	 * @param {objId} the id of the object to be found
	 * @returns {mixed} the object or undefined
	 */
	find: function(objId)	{
		var i = this.findIndex(objId);
		if (i == -1)
			return undefined;
		return this.objects[i];
	},
	
	/**
	 * Find the index of the object having specific ID
	 * @function
	 * @param {objId} the id of the object to be found
	 * @returns {mixed} the index of the object or -1
	 */
	findIndex: function(objId)	{
		for(var i=0;i<this.objects.length;i++)	{
			if (objId == this.objects[i].id)	{
				return i;
			}
		}
		return -1;
	}
});

/**
 * Entry-point class
 * @augments Class
 */
Application = Class.extend({
	/**
	 * Initialize fields
	 * @constructor
	 */
	init: function()	{
		if(Application.singleton == undefined){
			throw "Singleton class, can not be directly created !";
			return undefined;
		}
		this.systemProperties = new SystemProperty();
		this.resourceManager = new ResourceManager();
	},
	
	/**
	 * Access the application's resource manager
	 * @function
	 * @returns {mixed} the application's resource manager
	 */
	getResourceManager: function()	{
		return this.resourceManager;
	},
	
	/**
	 * Change the application's resource manager
	 * @function
	 * @param {ResourceManager} the resource manager to be used
	 */
	setResourceManager: function(rm)	{
		this.resourceManager = rm;
	},
	
	/**
	 * Get the system properties array
	 * @function
	 * @returns {mixed} the system properties
	 */
	getSystemProperties: function()	{
		return this.systemProperties;
	},
	
	/**
	 * Change the bootstrap of the application
	 * @function
	 * @returns {Bootstrap} the bootstrap of the application
	 */
	setBootstrap: function(bootstrap)	{
		this.bootstrap = bootstrap;
	},
	
	/**
	 * Begin the application. This should be called only once
	 * @function
	 */
	begin: function()	{
		this.bootstrap.run();
	},

	/**
	 * Get the application's object manager
	 * @function
	 * @returns {ObjectManager} the application's object manager
	 */
	getObjectManager: function()	{
		if (this.objMgr == undefined)
			this.objMgr = new ObjectManager();
		return this.objMgr;
	}
});

/**
 * Singleton Factory. Used to access initialize
 */
SingletonFactory = function(){};

SingletonFactory.getInstance = function(classname){
	if(classname.instance == undefined){
		classname.singleton = 0;
		classname.instance = new classname();
		classname.singleton = undefined;
	}
	return classname.instance;
};

/**
 * IMPLEMENTOR & HANDLERS
 */
InterfaceImplementor = Class.extend({
	init: function(){
		this.state = false;
	},

	implement: function(obj)	{
		
	},

	bind: function(obj, handler)	{
		new EventBinder().bindEvent(obj, handler);
	}
});

Handler = Class.extend({
	init: function(){
		
	},
	
	getEventName: function()	{
		return "";
	},
	
	onEvent: function(e)	{
		
	}
});

/**
 * Wrap the jquery object with our DisplayObject
 * In the future it will add classes, bind events... as well
 */
JQueryWrapper = Class.extend({
	init: function(obj, id)	{
		obj.id = id;
		this.obj = obj;
	},
	
	getWrappedObject: function()	{
		return this.obj;
	}
});