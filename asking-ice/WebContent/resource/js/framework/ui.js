/**
 * Base displayable object
 */
DisplayObject = Class.extend	({
	init: function()	{
		var app = SingletonFactory.getInstance(Application);
		this.id=0;
		this.type = "default";
		this.htmlClasses = new Array();
		this.interfaces = new Array();
		var objMgr = app.getObjectManager();
		this.className = "DisplayObject";
		objMgr.register(this);
	},
	
	addEventHandler: function(eventHandler)	{
		new EventBinder().bindEvent(this, eventHandler);
	},
	
	deserializeStyle: function(style)	{
		this.deserializedStyle = style;
	},
	
	serializeStyle: function()	{
		return this.getAttribute('style');
	},
	
	serialize: function()	{
		var obj = {};
		obj.className = this.className;
		return obj;
	},
	
	getPosition: function()	{
		return this.access().offset();
	},
	
	moveTo: function(top, left)	{
		this.access().css('left', left+"px");
		this.access().css('top', top+"px");
	},
	
	center: function()	{
		this.access().hAlign();
		this.access().vAlign();
	},
	
	moveToBR: function(bottom, right)	{
		this.access().css('bottom', bottom+"px");
		this.access().css('right', right+"px");
	},

	getType: function()	{
		return "ij-"+this.type;
	},

	toHtml: function()	{
		return "";
	},
	
	getParent: function()	{
		return this.parent;
	},
	
	setParent: function(parent)	{
		if (this.parent != undefined)	{
			this.parent.detachObject(this);
		}
		this.parent = parent;
	},
	
	getId: function()	{
		return this.id;
	},
	
	access: function()	{
		return $('#'+this.id);
	},
	
	resizeTo: function(width, height)	{
		this.access().css('width', width+"px");
		this.access().css('height', height+"px");
	},
	
	getDimension: function()	{
		var dim = {};
		dim.width = this.access().width();
		dim.height = this.access().height();
		return dim;
	},
	
	setStyle: function(styleName, value)	{
		this.access().css(styleName, value);
	},
	
	setAttribute: function(attrName, value)	{
		this.access().attr(attrName, value);
	},
	
	getAttribute: function(attrName)	{
		return this.access().attr(attrName);
	},
	
	implement: function(implementor)	{
		if($("#"+this.getId()).length > 0){
			implementor.implement(this);
			implementor.state = true;
		}
		this.interfaces.push(implementor);
		this.updateInterfaces();
	},
	
	addClass: function(className)	{
		this.htmlClasses.push(className);
		this.updateClasses();
	},
	
	getHtmlClasses: function()	{
		return this.htmlClasses;
	},
	
	show: function()	{
		this.access().show();
	},
	
	hide: function()	{
		this.access().hide();
	},
	
	dispose: function()	{
		var app = SingletonFactory.getInstance(Application);
		this.access().remove();
		app.getObjectManager().remove(this);
	},
	
	updateClasses: function()	{
		var classes = this.getHtmlClasses();
		var classNames = this.getType();
		for(var i=0;i<classes.length;i++)	{
			classNames+= " "+classes[i];
		}
		this.access().attr('class', classNames);
	},
	
	updateInterfaces: function()	{
		var interfaces = this.interfaces;
		for(var i=0;i<interfaces.length;i++)	{
			var implementor = interfaces[i];
			if (implementor != null && !implementor.state && $("#"+this.getId()).length > 0)	{
				implementor.implement(this);
				implementor.state = true;
			}
		}
	},
	
	afterLoad: function()	{
		this.setAttribute('style', this.deserializedStyle);
	},
	
	/**
	 * Update HTML element when properties are changed
	 */
	update: function()	{
		this.updateClasses();
		this.updateInterfaces();
	},
	
	afterCreate: function()	{
		this.update();
		new EventBinder().fireEvent(this.access(), 'object_created');
	}
});

/**
 * Container class. A container is an object which 'contains' other objects
 */
Container = DisplayObject.extend({
	init: function()	{
		this._super();
		this.objects = new Array();
		this.type = "container";
		this.className = "Container";
	},
	
	addObjectBeforePosition: function(obj, positionObj)	{
		this.objects.push(obj);
		//this.access().append(obj.toHtml());
		if($("#"+obj.access().attr("id")).length == 0){
			//console.log("Not existed before !, id: "+obj.access().attr("id"));
			$(positionObj).before(obj.toHtml());
		}else{
			//console.log("Just move !");
			obj.access().detach();
			obj.access().insertBefore(positionObj);
		}
		obj.setParent(this);
		obj.afterCreate();
	},
	
	addObject: function(obj)	{
		this.objects.push(obj);
		//this.access().append(obj.toHtml());
		if($("#"+obj.access().attr("id")).length == 0){
			//console.log("Not existed before !, id: "+obj.access().attr("id"));
			this.access().append(obj.toHtml());
		}else{
			//console.log("Just move !");
			obj.access().detach();
			obj.access().appendTo(this.access());
		}
		obj.setParent(this);
		obj.afterCreate();
	},
	
	afterCreate: function(obj)	{
		this._super();
		for(var i=0;i<this.objects.length;i++)	{
			this.objects[i].afterCreate();
		}
	},
	
	removeObject: function(object)	{
		for(var i=0;i<this.objects.length;i++)	{
			var obj = this.objects[i];
			if (obj.getId() == object.getId())	{
				this.objects.splice(i, 1);
				object.dispose();
			}
		}
	},
	
	detachObject: function(object)	{
		for(var i=0;i<this.objects.length;i++)	{
			var obj = this.objects[i];
			if (obj.getId() == object.getId())	{
				this.objects.splice(i, 1);
			}
		}
	},
	
	getObjects: function()	{
		return this.objects;
	},
	
	toHtml: function()	{
		var html = "";
		for(var i=0;i<this.objects.length;i++)	{
			html += this.objects[i].toHtml();
		}
		return html;
	}
});

Canvas = Container.extend({
	init: function()	{
		this._super();
		// FIXME: Store this list in another location?
		this.type = "canvas";
		this.id = generateId('canvas');
		this.className = "Canvas";
	},

	toHtml: function()	{
		return "<div id='"+this.id+"'>"+this._super()+"</div>";
	}
});

PrebuiltCanvas = Canvas.extend({
	init: function(id)	{
		this._super();
		this.id = id;
	},
	
	appendObject: function(object)	{
		this.access().append(object.access());
	}
});

/*
 * Font
 */
Font = Class.extend({
	init:function()	{
		this.fontFamily = 'Tahoma,sans-serif';
		this.fontSize = "12px";
		this.bold = false;
		this.italic = false;
		this.color = "#000000";
	},
	
	setFont: function(fontFamily, fontSize, bold, italic, color)	{
		this.fontFamily = fontFamily;
		this.fontSize = fontSize;
		this.bold = bold;
		this.italic = italic;
		this.color = color;
	},
	
	setFontFamily: function(fontFamily)	{
		this.fontFamily = fontFamily;
	},
	
	getFontFamily: function()	{
		return this.fontFamily;
	},
	
	setFontSize: function(fontSize)	{
		this.fontSize = fontSize;
	},
	
	getFontSize: function()	{
		return this.fontSize;
	},
	
	setBold: function(bold)	{
		this.bold = bold;
	},
	
	getBold: function()	{
		return this.bold;
	},
	
	setItalic: function(italic)	{
		this.italic = italic;
	},
	
	getItalic: function()	{
		return this.italic;
	},
	
	setColor: function(color)	{
		this.color = color;
	},
	
	getColor: function()	{
		return this.color;
	}
});