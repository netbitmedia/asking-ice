PortletCanvas = Canvas.extend({
	init: function(portletName)	{
		this._super();
		this.addClass('portlet');
		this.addClass('portlet-canvas');
	}
});

/**
 * An interface for all portlets
 * Exposed method:
 * 	- void onBegin()
 *  - void run()
 *  - void onEnd()
 *  - String getName()
 *  - void setPortletPlaceholder(PortletPlaceholder)
 *  - PortletPlaceholder getPortletPlaceholder()
 *  - getPage(): get the current page
 *  - getRequest(): get the current request
 *  - requestForResource(): get the resource in the prepared portlet-data
 *  - requestForEffectiveResource(): get the resource in the portlet's DOM
 *  - getLocalizedText(): get the localized text by ID
 *  - getLocalizedMessage(): get the message by ID
 *  @augments InterfaceImplementor
 *  @author griever
 */
PortletInterface = InterfaceImplementor.extend({
	implement: function(obj)	{
		obj.prototype.getName = obj.prototype.getName || function()	{
			return this.name;
		};
		obj.prototype.onBegin = obj.prototype.onBegin || function(){};
		obj.prototype.run = obj.prototype.run || function(){};
		obj.prototype.onEnd = obj.prototype.onEnd || function(){};
		obj.prototype.setPortletPlaceholder = obj.prototype.setPortletPlaceholder || function(plhd)	{
			this.placeholder = plhd;
		};
		
		obj.prototype.getPage = obj.prototype.getPage || function()	{
			return SingletonFactory.getInstance(Page);
		};
		
		obj.prototype.getInitParameters = obj.prototype.getInitParameters || function()	{
			if (this.initParams == undefined)
				this.initParams = Array();
			return this.initParams;
		};
		
		obj.prototype.setInitParameters = obj.prototype.setInitParameters || function(params)	{
			this.initParams = params;
		};
		
		obj.prototype.getRequest = obj.prototype.getRequest || function()	{
			return this.getPage().getRequest();
		};
		
		obj.prototype.requestForMatchingEffectiveResource = obj.prototype.requestForMatchingEffectiveResource || function(resourceName, condition)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			return rm.requestForCustomResource("#effective-area #"+this.name+"-"+resourceName+" "+condition);
		};
		
		obj.prototype.requestForResource = obj.prototype.requestForResource || function(resourceName)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			return rm.requestForCustomResource("#"+this.name+"-RootData #"+this.name+"-"+resourceName);
		};
		
		obj.prototype.requestForEffectiveResource = obj.prototype.requestForEffectiveResource || function(resourceName)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			return rm.requestForCustomResource("#effective-area #"+this.name+"-"+resourceName);
		};
		
		obj.prototype.onReloadPage = obj.prototype.onReloadPage || function()	{};
		
		obj.prototype.getResourceID = obj.prototype.getResourceID || function(resourceName)	{
			return this.name+"-"+resourceName;
		};
		
		obj.prototype.getLocalizedText = obj.prototype.getLocalizedText || function(resourceName)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			var res = rm.requestForResource(this.name, "Text"+resourceName);
			if (res == undefined)
				return undefined;
			return res.html();
		};
		
		obj.prototype.getLocalizedMessage = obj.prototype.getLocalizedMessage || function(resourceName)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			var res = rm.requestForResource(this.name, "Message"+resourceName);
			if (res == undefined)
				return undefined;
			var unresolved = res.html();
			
			var resolved = unresolved;
			//resolved string pattern
			for(var i=1;i<arguments.length;i++)	{
				resolved = resolved.replace("%"+i, arguments[i]);
			}
			return resolved;
		};
		
		obj.prototype.getPortletPlaceholder = obj.prototype.getPortletPlaceholder || function()	{
			return this.placeholder;
		};
	}
});

/**
 * An interface for all portlets which need rendering
 * Exposed method:
 * 	- Object model
 * 	- String viewId
 *  - void render()
 */
RenderInterface = InterfaceImplementor.extend({
	implement: function(obj)	{
		obj.prototype.render = obj.prototype.render || function(){
			this.viewId = this.viewId || this.getName()+"View";
			this.model = this.model || {};
//			if(this.viewId == undefined || this.model == undefined){
//				throw "No viewId or model for rendering";
//			}
			return tmpl(this.viewId, this.model);
		};
		
		obj.prototype.renderView = obj.prototype.renderView || function(view, model)	{
			return tmpl(this.name+"-"+view, model);
		};
	}
});

/**
 * A placeholder to store a single portlet
 * It acts as a bridge between Portlet and PortletCanvas
 * @augments Class
 * @author griever
 */
PortletPlaceholder = Class.extend({
	init: function(canvas)	{
		this.canvas = canvas;
	},
	
	/**
	 * Add an object to canvas
	 * @function
	 * @param {object} the object to add
	 */
	addToCanvas: function(object)	{
		//console.log('add '+object.toHtml()+' into '+this.canvas.id);
		this.canvas.addObject(object);
	},
	
	/**
	 * Clear everything and repaint the canvas
	 * @param {html} the HTML data to be painted
	 * @function
	 */
	paintCanvas: function(html)	{
		this.canvas.access().html(html);
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('HtmlUpdated');
	},
	
	/**
	 * Append to the canvas
	 * @param {html} the HTML data to be appended
	 * @function
	 */
	drawToCanvas: function(html)	{
		this.canvas.access().append(html);
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('HtmlUpdated');
	},
	
	/**
	 * Access the underlying canvas
	 * @returns {PortletCanvas} the canvas
	 */
	getCanvas: function()	{
		return this.canvas;
	}
});

/**
 * A container which 'runs' multiple portlets
 */
PortletContainer = Class.extend({
	init: function()	{
		if(PortletContainer.singleton == undefined){
			throw "Singleton class";
			return undefined;
		}
		this.portlets = Array();
	},
	
	/**
	 * Add a portlet to this container and initialize it
	 * @function
	 * @param {portlet} the portlet to be added
	 * @param {position} the position of the portlet
	 * @param {active} whether the portlet should be loaded
	 */
	addPortlet: function(portlet, item)	{
//		console.log('adding portlet: '+portlet.getName(), 'color: red');
		var portletMeta = {};
		for(var i in item)	{
			portletMeta[i] = item[i];
		}
		portletMeta.portlet = portlet;
		if (portletMeta.order == undefined)
			portletMeta.order = '';
		portletMeta.loaded = false;
		this.portlets.push(portletMeta);
		try 
		{
			portlet.onBegin();
		} 
		catch (err)	{
			log(err);
		}
	},
	
	/**
	 * Move the portlet to another position
	 * @function
	 * @param {portlet} the portlet to be moved
	 * @param {newPosition} the new position
	 */
	movePortlet: function(portletMeta, newPosition)	{
		var portletPosition = new PrebuiltCanvas(newPosition);
		var portletCanvas = new PrebuiltCanvas(portletMeta.portlet.getPortletPlaceholder().getCanvas().id);
		this.attachPortletHtml(portletPosition, portletCanvas, portletMeta);
	},
	
	/**
	 * Load all active portlets, execute them synchronously
	 * @function
	 */
	loadPortlets: function()	{
		for(var i=0;i<this.portlets.length;i++)	{
			var portletMeta = this.portlets[i];
			if (portletMeta.active == true && !portletMeta.loaded)	{
				this.activatePortlet(portletMeta);
				portletMeta.loaded = true;
			}
		}
	},
	
	/**
	 * Get all portlets
	 * @function
	 * @returns {Array} All loaded portlets
	 */
	getPortlets: function()	{
		return this.portlets;
	},
	
	/**
	 * Get portlet meta using the portlet's name
	 * @function
	 * @param {name} the portlet's name
	 */
	getPortletMetaByName: function(name)	{
		var i;
		for( i=0; i<this.portlets.length; i++ ){
			if(this.portlets[i].portlet.getName() == name){
				return this.portlets[i];
			}
		}
	},
	
	/**
	 * Remove portlet at the specified position
	 * @function
	 * @param {position} the position of the portlet to be removed
	 */
	removePortlet: function(position)	{
		var portletMeta = this.portlets[position];
		if (portletMeta != undefined)	{
			this.portlets.splice(position,1);
			portletMeta.portlet.onEnd();
			if (portletMeta.portlet.getPortletPlaceholder())	{
				//console.log("dispose canvas of portlet: "+portletMeta.portlet.getName());
				portletMeta.portlet.getPortletPlaceholder().getCanvas().dispose();
			}
		}
	},
	
	attachPortletHtml: function(portletPosition, portletCanvas, portletMeta)	{
		var jPortletCanvas = portletPosition.access();
		var canvases = jPortletCanvas.find('.portlet.portlet-canvas');

		var found = false;
		for(var i=0;i<canvases.length;i++)	{
			var canvasI = canvases[i];
			if ($(canvasI).attr('order') > portletMeta.order)	{
				portletPosition.addObjectBeforePosition(portletCanvas, canvasI);
				found = true;
				break;
			}
		}
		if (found == false)	{
			portletPosition.addObject(portletCanvas);
		}
		portletCanvas.access().attr('order', portletMeta.order);
	},
	
	/**
	 * Activate a portlet
	 * @function
	 * @param {portletMeta} the metadata of the portlet to be activated
	 */
	activatePortlet: function(portletMeta)	{
		var portlet = portletMeta.portlet;
		if (portletMeta.loaded)	{
			return;
		}
		var portletPosition = new PrebuiltCanvas(portletMeta.position);
		var portletCanvas = new PortletCanvas(portlet.name);
		this.attachPortletHtml(portletPosition, portletCanvas, portletMeta);
		portletCanvas.setAttribute('portlet', portlet.name);
		var portletPlaceholder = new PortletPlaceholder(portletCanvas);
		portlet.setPortletPlaceholder(portletPlaceholder);
		portletMeta.loaded = true;
		try
		{
			portlet.run();
		} 
		catch (err)	{
			log(err);
		}
	},
	
	/**
	 * Deactivate a portlet
	 * @function
	 * @param {portletMeta} the metadata of the portlet to be deactivated
	 */
	deactivatePortlet: function(portletMeta)	{
		var portlet = portletMeta.portlet;
		if (!portletMeta.loaded)	{
			return;
		}
		portletMeta.loaded = false;
		if (portlet.getPortletPlaceholder())	{
			portlet.getPortletPlaceholder().paintCanvas('');
		}
	}
});