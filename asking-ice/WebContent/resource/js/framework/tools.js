/**
 * Image object
 */
ImageObject = DisplayObject.extend	({
	
	init: function(src)	{
		this._super();
		if (!src.match("http://") && !src.match("https://")){
			config = new Config();
			this.src = config.getRoot()+src;
		}else{
			this.src = src;
		}
		this.id = generateId('image');
		this.type = "Image";
		this.zIndex = 1000;
		this.className = "ImageObject";
	},
	
	toHtml: function()	{
		return "<img id='"+this.id+"' src='"+this.src+"' ></img>";
	},
	
	getSrc: function()	{
		return this.src;
	}
});

/**
 * Rotatable
 */
RotatableImage = ImageObject.extend({
	init: function(src)	{
		this._super(src);
		this.prevrotation = 0;
		this.className = "RotatableImage";
	},
	
	setPrevRotation: function(rot){
		if (rot > 180){
			rot = rot - 180;
		}
		if (rot < -180){
			rot = rot + 180;
		}
		this.prevrotation = rot;
	},
	
	getPrevRotation: function(){
		return this.prevrotation;
	},
	
	rotate: function(e)	{
		var parent = this.getParent();
		var left = this.getPosition().left;
		var top = this.getPosition().top;
		
		var h = top - parent.baseDotTL.getPosition().top - 7;
		var w = left - parent.baseDotTL.getPosition().left - 7;
		
		var rad = Math.atan2(h, w);
		var deg = Math.round(rad*180/Math.PI);
		parent.access().css('-moz-transform', 'rotate('+deg+'deg)');
		parent.access().css('-webkit-transform', 'rotate('+deg+'deg)');
		parent.access().css('transform', 'rotate('+deg+'deg)');
	}
});


/**
 * Textbox
 */
TextArea = DisplayObject.extend	({
	
	init: function(txt)	{
		this._super();
		this.font = new Font();
		this.txt = txt;
		this.id = generateId('textarea');
		this.type = "TextArea";
		this.implement(new ClickTextAreaStopEvent());
		this.implement(new BlurTextAreaUpdate());
		this.className = "TextArea";
	},
	
	toHtml: function()	{
		return "<textarea id='"+this.id+"' value='"+this.txt+"'></textarea>";
	},
		
	getText: function()	{
		return this.access().val();
	},
	
	getFont: function(){
		return this.font;
	},
	
	setFont: function(font){
		this.font = font;
	},
	
	updateText: function()	{
		this.parent.updateText(this.getText(),this.getFont());
		this.hide();
	},
	
	focus: function()	{
		this.access().focus();
	}
});

/**
 * Label
 */
Label = DisplayObject.extend	({
	
	init: function(txt)	{
		this._super();
		this.txt = txt;
		this.id = generateId('text');
		this.type = "Label";
		this.className = "Label";
	},
	
	toHtml: function()	{
		return "<label id='"+this.id+"' value='"+this.txt+"'></label>";
	},
		
	getText: function()	{
		return this.access().html();
	},
	
	setText: function(txt,font)	{
		if(font==null){
			this.access().html(txt);
		}else{
			var text = txt;
			var fontText = "font-family: "+font.getFontFamily()+"; font-size:"+font.getFontSize();
			fontText += "; color:"+font.getColor();
			if(font.getItalic()){
				fontText += ";font-style:italic";
			}else{
				fontText += ";font-style:normal";
			}
			if(font.getBold()){
				fontText += ";font-weight:bold";
			}
			text = "<span style='"+fontText+"'>"+text+"</span>";
			this.access().html(text);
		}
	}
});

/*
* ContextMenu class. A context menu is trigger by the right click, holding many contextMenuItem
*/
ContextMenu = Canvas.extend({
	init: function()	{
		this._super();
		this.items = new Array();
		this.type = 'contextmenu';
		this.className = "ContextMenu";
	},
	
	addItem: function(item){
		this.items.push(item);
		this.addObject(item);
		this.update();
	},
	
	afterCreate: function(){
		this._super();
		this.setStyle('zIndex','1000');
		this.update();
	}
});

/*
* ContextMenuItem class. A context menu item is an item binding to events
*/
ContextMenuItem = Canvas.extend({
	init: function(lbl,obj)	{
		this._super();
		this.label_txt = lbl;
		this.label = new Label('');
		this.addObject(this.label);		
		this.type = "contextmenuitem";
		this.originObject = obj;
		this.className = "ContextMenuItem";
	},
	
	afterCreate: function(){
		this.label.setText(this.label_txt);
		this.update();
	},
	
	setOriginObject: function(obj)	{
		this.originObject = obj;
	},
	
	getOriginObject: function()	{
		return this.originObject;
	}
});

DraggableWrapper = Class.extend({
	wrap: function(obj)	{
		obj.access().draggable();
		obj.access().css('position','absolute');
		return obj;
	}
});

ImageIconWrapper = Class.extend	({
	wrap: function(img)	{
		img.addClass("icon");
		return img;
	}
});

ClickableImageWrapper = Class.extend({
	wrap: function(img)	{
		img.implement(new ClickIcon());
		return img;
	}
});

ImageBox = Canvas.extend({
	init: function(src)	{
		this._super();
		this.src = src;
		this.img = new Image(src);
		this.baseDotTL = new Image('images/delete-small.png');
		this.resizeDotBR = new Image('images/sq.png');
		this.dummyDotTR = new Image('images/sq.png');
		this.dummyDotBL = new Image('images/sq.png');
		this.rotateIcon = new RotatableImage('images/sq.png');
		this.textArea = new TextArea('');
		this.text = new Label('');

		this.addObject(this.resizeDotBR);
		this.addObject(this.baseDotTL);
		this.addObject(this.dummyDotTR);
		this.addObject(this.dummyDotBL);
		this.addObject(this.rotateIcon);
		this.addObject(this.textArea);
		this.addObject(this.text);
		this.addObject(this.img);
		this.type = "imagebox";
		this.className = "ImageBox";
		
		app.getObjectManager().registerMainObjects(this);
	},
	
	getTextArea: function()	{
		return this.textArea;
	},
	
	getZIndex: function()	{
		if(this.zIndex == null){
			this.zIndex = this.access().css("z-index");
		}
		if(this.zIndex == null){
			this.zIndex = 1000;
		}
		return this.zIndex;
	},
	
	setZIndex: function(index)	{
		this.zIndex = index;
		this.setStyle("z-index",this.zIndex);
		this.update();
	},
	
	showTextArea: function()	{
		this.text.hide();
		this.textArea.show();
		this.textArea.focus();
	},
	
	showPlainText: function()	{
		this.textArea.hide();
		this.text.show();
		this.text.center();
	},
	
	afterCreate: function()	{
		this._super();
		
		this.resizeDotBR.implement(new ResizableBR());
		this.rotateIcon.implement(new Rotatable());
		this.dummyDotTR.implement(new ResizableTR());
		this.dummyDotBL.implement(new ResizableBL());
		this.baseDotTL.implement(new DeleteImageBox());
		
		this.img.addClass('img-item');
		this.img.setStyle('height', '50px');
		
		var d = new DraggableWrapper();
		d.wrap(this);
		d.wrap(this.resizeDotBR);
		d.wrap(this.rotateIcon);
		d.wrap(this.dummyDotTR);
		d.wrap(this.dummyDotBL);
		
		this.baseDotTL.addClass('sq');
		this.resizeDotBR.addClass('sq');
		this.dummyDotTR.addClass('sq');
		this.dummyDotBL.addClass('sq');
		this.rotateIcon.addClass('sq');
		
		this.updateImages();

		this.implement(new DragSelectImageBox());
		this.implement(new ClickImageBox());
		this.implement(new ClickImageCreateText());
		this.implement(new CreateImageBoxContextMenu());
		this.showPlainText();
		this.baseDotTL.setStyle('position','absolute');
	},
	
	updateText: function(txt,font)	{
		this.text.setText(txt,font);
		this.showPlainText();
	},
	
	updateImages: function()	{
		var dim = this.img.getDimension();
		this.resizeTo(dim.width, dim.height);
		// move base dot & resize dot to top-left and bottom-right respectively
		// and relatively
		var x0 = -11;
		var y0 = -11;
		var x1 = dim.width-5;
		var y1 = dim.height-5;
		
		this.baseDotTL.moveTo(y0, x0);		
		this.resizeDotBR.moveTo(y1-5, x1-5);
		this.dummyDotTR.moveTo(y0, x1);
		this.dummyDotBL.moveTo(y1, x0);
		this.rotateIcon.moveTo(y1/2-10, x1+10);
	},
	
	select: function()	{
		this.baseDotTL.show();
		this.resizeDotBR.show();
		this.dummyDotTR.show();
		this.dummyDotBL.show();
		this.rotateIcon.show();
	},
	
	deselect: function()	{
		this.baseDotTL.hide();
		this.resizeDotBR.hide();
		this.dummyDotTR.hide();
		this.dummyDotBL.hide();
		this.rotateIcon.hide();
	},
	
	deserializeText: function(txt,fontData)	{
		this.getTextArea().txt = txt;
		var f = new Font();
		f.setFont(fontData.fontFamily, fontData.fontSize, fontData.bold, fontData.italic, fontData.color);
		this.getTextArea().setFont(f);
	},
	
	serialize: function()	{
		var obj = this._super();
		obj.params = {};
		obj.params.src = this.src;
		obj.params.style = this.serializeStyle();
		obj.params.txt = this.getTextArea().getText();
		obj.params.font = this.getTextArea().getFont();
		return obj;
	},
	
	afterLoad: function()	{
		this._super();
		this.img.resizeTo(this.getDimension().width, this.getDimension().height);
		this.updateImages();
		this.getTextArea().access().val(this.getTextArea().txt);
		this.updateText(this.getTextArea().getText(), this.getTextArea().getFont());
	}
});

Deserializer = Class.extend({
	deserialize: function(serialized)	{
		if (serialized.className == "ImageBox")	{
			var imageBox = new ImageBox(serialized.params.src);
			imageBox.deserializeStyle(serialized.params.style);
			imageBox.deserializeText(serialized.params.txt,serialized.params.font);
			return imageBox;
		}
	}
});

Button = DisplayObject.extend({
	init: function(txt)	{
		this._super();
		this.txt = txt;
		this.id = generateId('button');
		this.type = "Button";
		this.className = "Button";
	},
	
	toHtml: function()	{
		return "<button id='"+this.id+"' class='"+this.getType()+"'>"+this.txt+"</button>";
	}
});

ToggleButton = DisplayObject.extend({
	init: function(txt,state)	{
		this._super();
		this.txt = txt;
		this.id = generateId('togglebutton');
		this.type = "togglebutton";
		this.className = "ToggleButton";
		this.state = state;
		this.implement(new ClickToggleButton());
	},
	
	afterCreate: function(){
		this._super();
		if(this.state){
			this.addClass("toggledown");
		}
	},
	
	toHtml: function()	{
		return "<a id='"+this.id+"' class='"+this.getType()+"'>"+this.txt+"</a>";
	}
});

/*
* IconSet class. An icon set is a group of icons, grouped by a label which can perform accordion behaviour.
*/

IconSet = Canvas.extend({
	init: function(lbl)	{
		this._super();
		this.lblText = lbl;
		this.container = new Canvas();
		this.header = new Canvas();
		this.label =  new Label('');
		this.header.addObject(this.label);
		this.addObject(this.header);
		this.addObject(this.container);
	},
	
	afterCreate: function()	{
		this.label.addClass('ij-iconsetlbl');
		this.label.setText(this.lblText);
		this.setStyle('position','relative');
		this.header.setStyle('width',(this.access().width()+10)+"px");
		this.header.addClass('ij-headericonset');
		this.container.addClass('ij-containericonset');
		this.header.implement(new ClickHeaderIconSet());
	},
	
	addIcon: function(img){
		img = new ImageIconWrapper().wrap(img);
		img = new ClickableImageWrapper().wrap(img);
		this.container.addObject(img);
	}
});

ToolBox = Canvas.extend({
	init: function()	{
		this._super();
		// FIXME: Store this list in another location?
		this.type = "toolbox";
		this.id = "tool";
		this.addClass("tool");
		this.iconSets = new Array();
	},

	addIcon: function(img)	{
		img = new ImageIconWrapper().wrap(img);
		img = new ClickableImageWrapper().wrap(img);
		this.addObject(img);
	},
	
	addIconSet: function(lbl)	{
		iconset = new IconSet(lbl);
		this.iconSets.push(iconset);
		this.addObject(iconset);
	},
	
	addIconToSet: function(id,img)	{
		this.iconSets[id].addIcon(img);
	}
});

/**
 * IMPLEMENTOR & HANDLERS
 */

ClickImageBox = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ClickImageBoxHandler());
	}
});

ClickImageBoxHandler = Handler.extend({
	getEventName: function()	{
		return "click";
	},
	
	onEvent: function(e, obj)	{
		app.select(obj);
		e.stopPropagation();
	}
});

ResizableTR = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ResizableTRDragHandler());
		this.bind(obj, new ResizableDragStopHandler());
		this.bind(obj, new MouseOverSqHandler("tr"));
		this.bind(obj, new MouseOutSqHandler("tr"));
	}
});

ResizableTRDragHandler = Handler.extend({
	getEventName: function()	{
		return "drag";
	},
	
	onEvent: function(e, obj)	{		
		var parent = obj.getParent();
		var left = obj.getPosition().left;
		var min = 50;
		var w = left - parent.baseDotTL.getPosition().left - 7;
		var h = parent.access().height();
		if (w < min)	{
			obj.setStyle('left', min);
			obj.access().draggable('disable');
			w = min;
		}
		parent.img.resizeTo(w, h);
		parent.updateImages();
	}
});

ResizableBL = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ResizableBLDragHandler());
		this.bind(obj, new ResizableDragStopHandler());
		this.bind(obj, new MouseOverSqHandler("bl"));
		this.bind(obj, new MouseOutSqHandler("bl"));		
	}
});

ResizableBLDragHandler = Handler.extend({
	getEventName: function()	{
		return "drag";
	},
	
	onEvent: function(e, obj)	{		
		var parent = obj.getParent();
		var top = obj.getPosition().top;
		var min = 50;
		var w = parent.access().width();
		var h = top - parent.baseDotTL.getPosition().top - 7;
		if (h < min)	{
			obj.setStyle('left', min);
			obj.access().draggable('disable');
			h = min;
		}
		parent.img.resizeTo(w, h);
		parent.updateImages();
	}
});


ResizableBR = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ResizableBRDragHandler());
		this.bind(obj, new ResizableDragStopHandler());
		this.bind(obj, new MouseOverSqHandler("br"));
		this.bind(obj, new MouseOutSqHandler("br"));		
	}
});

ResizableDragStopHandler = Handler.extend({
	getEventName: function()	{
		return "dragstop";
	},

	onEvent: function(e, obj)	{
		obj.access().draggable('enable');
		obj.getParent().updateImages();
	}
});

ResizableBRDragHandler = Handler.extend({
	getEventName: function()	{
		return "drag";
	},

	onEvent: function(e, obj)	{
		var parent = obj.getParent();
		var left = obj.getPosition().left;
		var top = obj.getPosition().top;
		
		var min = 50;
		var h = top - parent.baseDotTL.getPosition().top - 7;
		var w = left - parent.baseDotTL.getPosition().left - 7;
		if (h < min)	{
			obj.setStyle('top', min);
			obj.access().draggable('disable');
			h = min;
		}
		
		if (w < min)	{
			obj.setStyle('left', min);
			obj.access().draggable('disable');
			w = min;
		}
		
		parent.img.resizeTo(w, h);
		parent.updateImages();
	}
});

MouseOverSqHandler = Handler.extend({
	init: function(type)	{
		this.type = type;
	},

	getEventName: function()	{
		return "mouseover";
	},
	
	onEvent: function(e, obj)	{
		var styleName = "sq"+this.type;
		obj.access().addClass("sqhover");
		obj.access().addClass(styleName);
	}
});

MouseOutSqHandler = Handler.extend({
	init: function(type)	{
		this.type = type;
	},

	getEventName: function()	{
		return "mouseout";
	},
	
	onEvent: function(e, obj)	{
		styleName = "sq"+this.type;
		obj.access().removeClass("sqhover");
		obj.access().removeClass(styleName);
	}
});

DragSelectImageBox = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new DragSelectImageBoxHandler());
// this.bind(obj, new DragStopImageBoxHandler());
	}
});

DragStopImageBoxHandler = Handler.extend({
	getEventName: function()	{
		return "dragstop";
	},
	
	onEvent: function(e, obj)	{
		app.select(obj);
	}
});

DragSelectImageBoxHandler = Handler.extend({
	getEventName: function()	{
		return "drag";
	},
	
	onEvent: function(e, obj)	{
		app.select(obj);
// obj.deselect();
	}
});

ClickIcon = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ClickIconHandler());
	}
});

ClickIconHandler = Handler.extend({
	getEventName: function()	{
		return "click";
	},
	
	onEvent: function(e, obj)	{
		var main = app.getMainArea();
		var toolBox = app.getToolBox();
		var item = new ImageBox(obj.getSrc());
		var i = 0;
		main.addObject(item);
		
		item.addClass('item');
		item.moveTo(toolBox.getPosition().top, 600);
		app.select(item);
		
		items = main.getObjects();
		i = items.length;
		items[i] = i;
		item.setZIndex(i);
		item.setAttribute('state','silent');
	}
});

ClickImageCreateText = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ClickImageCreateTextHandler());
	}
});

ClickImageCreateTextHandler = Handler.extend({
	getEventName: function()	{
		return "dblclick";
	},
	
	onEvent: function(e, obj)	{
		obj.showTextArea();
	}
});

ClickTextAreaStopEvent = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ClickTextAreaStopEventHandler());
	}
});

ClickTextAreaStopEventHandler = Handler.extend({
	getEventName: function()	{
		return "click";
	},
	
	onEvent: function(e, obj)	{
		e.stopPropagation();
	}
});

BlurTextAreaUpdate = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new BlurTextAreaUpdateHandler());
	}
});
	
BlurTextAreaUpdateHandler = Handler.extend({
	getEventName: function()	{
		return "blur";
	},
	
	onEvent: function(e, obj)	{
		obj.updateText();
	}
});

ClickCanvasDeselect = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ClickCanvasDeselectHandler());
	}
});
	
ClickCanvasDeselectHandler = Handler.extend({
	getEventName: function()	{
		return "click";
	},
	
	onEvent: function(e, obj)	{
		app.deselect();
	}
});

Rotatable = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new RotateMouseMove());
		this.bind(obj, new RotateStop());
	}
});

RotateStop = Handler.extend({
	getEventName: function()	{
		return "dragstop";
	},

	onEvent: function(e, obj)	{
		obj.getParent().updateImages();
	}
});

RotateMouseMove = Handler.extend({
	getEventName: function()	{
		return "drag";
	},

	onEvent: function(e, obj)	{
		obj.rotate(e);
	}
});

ClickAlert = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ClickAlertHandler());
	}
});

ClickAlertHandler = Handler.extend({
	getEventName: function()	{
		return "click";
	},

	onEvent: function(e, obj)	{
		alert('hello');
	}
});

DeleteImageBox = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new DeleteImageBoxHandler());
		this.bind(obj, new MouseOverSqHandler("tl"));
		this.bind(obj, new MouseOutSqHandler("tl"));	
	}
});

DeleteImageBoxHandler = Handler.extend({
	getEventName: function()	{
		return "click";
	},
	
	onEvent: function(e, obj)	{
		obj.parent.dispose();
	}
});

ClickExportJPG = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ClickExportJPGHandler());
	}
});

ClickExportJPGHandler = Handler.extend({
	getEventName: function()	{
		return "click";
	},
	
	onEvent: function(e, obj)	{
		toimg();
	}
});

ClickHeaderIconSet = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ClickHeaderIconSetHandler());
	}
});

ClickHeaderIconSetHandler = Handler.extend({
	getEventName: function()	{
		return "click";
	},
	
	onEvent: function (e, obj)	{
		obj.parent.container.access().toggle();
	}
});

CreateImageBoxContextMenu = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new CreateImageBoxContextMenuHandler());
	}
});

CreateImageBoxContextMenuHandler = InterfaceImplementor.extend({
	getEventName: function()	{
		return "contextmenu";
	},
	
	onEvent: function (e, obj)	{
		e.preventDefault();
		if(app.getObjectManager().context != null){
			app.getObjectManager().context.dispose();
		}
		var contextMenu = new ContextMenu();
		var moveToBack = new ContextMenuItem('Move to back',obj);
		var moveBackward = new ContextMenuItem('Move backward',obj);
		var moveToFront = new ContextMenuItem('Move to front',obj);
		var moveForward = new ContextMenuItem('Move forward',obj);
		var properties = new ContextMenuItem('Properties',obj);
		var zIndex = new ContextMenuItem('Z-index',obj);
		var main = app.getMainArea();
		var _top = e.pageY;
		var _left = e.pageX;		
				
		properties.implement(new EventPropertiesContextMenu());
		zIndex.implement(new EventZIndexContextMenu());
		moveToBack.implement(new EventMoveToBackContextMenu());
		moveBackward.implement(new EventMoveBackwardContextMenu());
		moveToFront.implement(new EventMoveToFrontContextMenu());		
		moveForward.implement(new EventMoveForwardContextMenu());

		contextMenu.addItem(moveToBack);
		contextMenu.addItem(moveToFront);
		contextMenu.addItem(moveBackward);
		contextMenu.addItem(moveForward);
		contextMenu.addItem(zIndex);
		contextMenu.addItem(properties);
		
		main.addObject(contextMenu);
		contextMenu.setStyle('top',_top);
		contextMenu.setStyle('left',_left);
		objMgr = app.getObjectManager().registerContext(contextMenu);
	}
});

EventMoveToBackContextMenu = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ClickMoveToBackContextMenuHandler());
		this.bind(obj, new MouseOverContextMenuItemHandler());
		this.bind(obj, new MouseOutContextMenuItemHandler());
	}
});

ClickMoveToBackContextMenuHandler = Handler.extend({
	getEventName: function(){
		return "click";
	},
	
	onEvent: function(e,obj){
		var objManager = app.getObjectManager();
		var obj = obj.getOriginObject();
		var thisZIndex = obj.getZIndex();
		var indexArr = new Array();
		var mainObjects = objManager.getMainObjects();
		for(var i=0;i<mainObjects.length;i++){
			indexArr.push(mainObjects[i].getZIndex());
		}
		var minIndex = Array.min(indexArr);
		if(minIndex == thisZIndex){
			return;
		}else{
			for(var i=0;i<mainObjects.length;i++){
				if(mainObjects[i].getZIndex() < thisZIndex){
					mainObjects[i].setZIndex(Array.nextBigger(indexArr,mainObjects[i].getZIndex()));
				}
			}
			obj.setZIndex(minIndex);
		}
		/*
		* update display
		*/
		for(var i=0;i<mainObjects.length;i++){
			mainObjects[i].update();
		}
	}
});

EventMoveToFrontContextMenu = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ClickMoveToFrontContextMenuHandler());
		this.bind(obj, new MouseOverContextMenuItemHandler());
		this.bind(obj, new MouseOutContextMenuItemHandler());
	}
});

ClickMoveToFrontContextMenuHandler = Handler.extend({
	getEventName: function(){
		return "click";
	},
	
	onEvent: function(e,obj){
		var objManager = app.getObjectManager();
		var obj = obj.getOriginObject();
		var thisZIndex = obj.getZIndex();
		var indexArr = new Array();
		var mainObjects = objManager.getMainObjects();
		for(var i=0;i<mainObjects.length;i++){
			indexArr.push(mainObjects[i].getZIndex());
		}
		var maxIndex = Array.max(indexArr);
		if(maxIndex == thisZIndex){
			return;
		}else{
			for(var i=0;i<mainObjects.length;i++){
				if(mainObjects[i].getZIndex() > thisZIndex){
					mainObjects[i].setZIndex(Array.nextLess(indexArr,mainObjects[i].getZIndex()));
				}
			}
			obj.setZIndex(maxIndex);
		}
		/*
		* update display
		*/
		for(var i=0;i<mainObjects.length;i++){
			mainObjects[i].update();
		}	}
});

EventMoveBackwardContextMenu = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ClickMoveBackwardContextMenuHandler());
		this.bind(obj, new MouseOverContextMenuItemHandler());
		this.bind(obj, new MouseOutContextMenuItemHandler());
	}
});

ClickMoveBackwardContextMenuHandler = Handler.extend({
	getEventName: function(){
		return "click";
	},
	
	onEvent: function(e,obj){
		var objManager = app.getObjectManager();
		var obj = obj.getOriginObject();
		var thisZIndex = obj.getZIndex();
		var indexArr = new Array();
		var mainObjects = objManager.getMainObjects();
		for(var i=0;i<mainObjects.length;i++){
			indexArr.push(mainObjects[i].getZIndex());
		}
		var minIndex = Array.min(indexArr);
		var id = -1;
		if(minIndex == thisZIndex){
			return;
		}else{
			minIndex = -1;
			for(var i=0;i<mainObjects.length;i++){
				if(mainObjects[i].getZIndex() < thisZIndex && mainObjects[i].getZIndex() > minIndex){
					minIndex = mainObjects[i].getZIndex();
					id = i;
				}
			}
			mainObjects[id].setZIndex(thisZIndex);
			obj.setZIndex(minIndex);
		}
		app.select(obj);
		for(var i=0;i<mainObjects.length;i++){
			mainObjects[i].update();
		}
	}
});

EventMoveForwardContextMenu = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ClickMoveForwardContextMenuHandler());
		this.bind(obj, new MouseOverContextMenuItemHandler());
		this.bind(obj, new MouseOutContextMenuItemHandler());
	}
});

ClickMoveForwardContextMenuHandler = Handler.extend({
	getEventName: function(){
		return "click";
	},
	
	onEvent: function(e,obj){
		var objManager = app.getObjectManager();
		var obj = obj.getOriginObject();
		var thisZIndex = obj.getZIndex();
		var indexArr = new Array();
		var mainObjects = objManager.getMainObjects();
		for(var i=0;i<mainObjects.length;i++){
			indexArr.push(mainObjects[i].getZIndex());
		}
		var maxIndex = Array.max(indexArr);
		var id = -1;
		if(maxIndex == thisZIndex){
			return;
		}else{
			maxIndex = 1000;
			for(var i=0;i<mainObjects.length;i++){
				if(mainObjects[i].getZIndex() > thisZIndex && mainObjects[i].getZIndex() < maxIndex){
					maxIndex = mainObjects[i].getZIndex();
					id = i;
				}
			}
			mainObjects[id].setZIndex(thisZIndex);
			obj.setZIndex(maxIndex);
		}
		app.select(obj);
		for(var i=0;i<mainObjects.length;i++){
			mainObjects[i].update();
		}
	}
});

EventZIndexContextMenu = InterfaceImplementor.extend({
	implement: function(obj)	{
		//this.bind(obj, new ClickPropertiesContextMenuHandler());
		this.bind(obj, new MouseOverContextMenuItemHandler());
		this.bind(obj, new MouseOutContextMenuItemHandler());
	}
});

EventPropertiesContextMenu = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ClickPropertiesContextMenuHandler());
		this.bind(obj, new MouseOverContextMenuItemHandler());
		this.bind(obj, new MouseOutContextMenuItemHandler());
	}
});

MouseOverContextMenuItemHandler = Handler.extend({
	getEventName: function()	{
		return "mouseover";
	},
	
	onEvent: function (e,obj)	{
		obj.setStyle('background-color','#888');
		obj.setStyle('color','#fff');
	}
});

MouseOutContextMenuItemHandler = Handler.extend({
	getEventName: function()	{
		return "mouseout";
	},
	
	onEvent: function (e,obj)	{
		obj.setStyle('background-color','#fff');
		obj.setStyle('color','#000');
	}
});

ClickPropertiesContextMenuHandler = Handler.extend({
	getEventName: function()	{
		return "click";
	},
	
	onEvent: function (e,obj)	{
		var str = "<div style='padding-left:50px; text-align:left'>";
		var controls = new Array();
		var btnOK = new Button("OK");
		var btnApply = new Button("Apply");
		var font = obj.getOriginObject().getTextArea().getFont();
		controls.push(btnApply);
		controls.push(btnOK);
		str += "Top:"+obj.getOriginObject().getPosition().top+"px ; Left:"+obj.getOriginObject().getPosition().left+"px<br/>";
		str += "Width:"+obj.getOriginObject().access().width()+"px ; Height:"+obj.getOriginObject().access().height()+"px<br/>";
		str += "Font-size: <input type='text' id='properties-font-size' value='"+font.getFontSize()+"' /><br/>";
		str += "Bold, Italic, etc<br/>";
		str += "Font-family: <input type='text' id='properties-font-family' value='"+font.getFontFamily()+"' /><br/>";
		str += "Color: <input type='text' id='properties-font-color' value='"+font.getColor()+"' /><br/>";
		str += "</div>";
		dialogId = dialog("Properties",str,controls);
		btnApply.implement(new ClickPropertiesButtonApply(obj.getOriginObject()));
		btnOK.implement(new ClickPropertiesButtonOK(dialogId,obj.getOriginObject()));
	}
});

ClickPropertiesButtonApply = InterfaceImplementor.extend({
	init: function(obj)	{
		this._super();
		this.obj = obj;
	},
	
	implement: function(obj)	{
		this.bind(obj, new ClickPropertiesButtonApplyHandler(this.obj));
	}
});

ClickPropertiesButtonApplyHandler = Handler.extend({
	init: function(obj){
		this.obj = obj;
	},
	
	getEventName: function(){
		return "click";
	},
	
	onEvent: function(e,o)	{
		var font = this.obj.getTextArea().getFont();
		font.setFontSize($("#properties-font-size").val());
		font.setFontFamily($("#properties-font-family").val());
		font.setColor($("#properties-font-color").val());
		this.obj.getTextArea().setFont(font);
		this.obj.getTextArea().updateText();
	}
});

ClickPropertiesButtonOK = InterfaceImplementor.extend({
	init: function(dialogId,obj)	{
		this._super();
		this.obj = obj;
		this.id = dialogId;
	},
	
	implement: function(obj)	{
		this.bind(obj, new ClickPropertiesButtonOKHandler(this.id,this.obj));
	}
});

ClickPropertiesButtonOKHandler = Handler.extend({
	init: function(id,obj){
		this.obj = obj;
		this.id = id;
	},
	
	getEventName: function(){
		return "click";
	},
	
	onEvent: function(e,o)	{
		var font = this.obj.getTextArea().getFont();
		font.setFontSize($("#properties-font-size").val());
		font.setFontFamily($("#properties-font-family").val());
		font.setColor($("#properties-font-color").val());
		this.obj.getTextArea().setFont(font);
		this.obj.getTextArea().updateText();
		$("#dialog_div_"+this.id).remove();
	}
});

SaveDiagram = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ClickSaveDiagramHandler());
	}
});

ClickSaveDiagramHandler = Handler.extend({
	getEventName: function()	{
		return "click";
	},
	
	onEvent: function (e,obj)	{
		var objs = app.getObjectManager().getMainObjects();			
		var str = "";
		var o;
		var controls = new Array();
		var btnSave = new Button("Save");
		var btnCancel = new Button("Cancel");
		var dialogId;
		var dname;
		var objsToSave = new Array();
		for(var i=0;i<objs.length;i++){
			o = objs[i];
			var objToSave = objs[i].serialize();
			objsToSave.push(objToSave);
		}
		str += "Diagram Name: <input type='text' id='diagramname' value='default' />";
		controls.push(btnSave);
		controls.push(btnCancel);
		dialogId = dialog("Object detail",str,controls);
		dname = $("#diagramname");
		btnCancel.implement(new CloseDialog(dialogId));
		btnSave.implement(new SaveFile(dialogId,dname,objsToSave));
	}
});

SaveFile = InterfaceImplementor.extend({
	init: function(dialogId,dname,objsToSave){
		this._super();
		this.id = dialogId;
		this.dname = dname;
		this.objsToSave = objsToSave;
	},
	
	implement: function(obj){
		this.bind(obj, new ClickSaveFileHandler(this.id,this.dname,this.objsToSave));
	}
});

ClickSaveFileHandler = Handler.extend({
	init: function(id,dname,objsToSave){
		this.id = id;
		this.dname = dname;
		this.objsToSave = objsToSave;
	},
	
	getEventName: function(){
		return "click";
	},

	onEvent: function(e,obj){
		var name = this.dname.val();
		var json = {};
		var url = 'services/save.php';
		json.name = name;
		json.diagram = $.toJSON(this.objsToSave);
		$.ajax({
			cache: false,
			type:'POST',
			url: url,
			data: json,
			beforeSend: function(){
				alertMsg("alert","<img src='images/wait.gif'/>");
			},
			complete: function (data){
				alertMsg("alert",name +" is saved");
			}
		});
		
		$("#dialog_div_"+this.id).remove();
	}
	
});

LoadDiagram = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ClickLoadDiagramHandler());
	}
});

ClickLoadDiagramHandler = Handler.extend({
	getEventName: function()	{
		return "click";
	},
	
	onEvent: function (e,obj)	{
		var str = "";
		var btnLoad = new Button("Load");
		var controls = new Array();
		var dname = "";
		var url = "services/listDiagrams.php";
		$.ajax({
			cache: false,
			type:'GET',
			url: url,
			beforeSend: function(){
				$("#dialogload-dlist").html("<img src='images/wait.gif'/>");
			},
			complete: function (data){
				var diagrams = $.parseJSON(data.responseText);
				var str = "";
				for(var i=0;i<diagrams.length;i++)	{
					var diagram = diagrams[i];
					str += diagram.name+",";
				}
				$("#dialogload-dlist").html(str);
			}
		});		
		str = "<div id='dialogload-dlist'></div>Diagram Name: <input id='diagramname' name='diagramname' type='text'/>";
		controls.push(btnLoad);
		dialogId = dialog("Choose file",str,controls);
		dname = $("#diagramname"); 
		btnLoad.implement(new ExtractDiagram(dialogId,dname));
	}
});

ExtractDiagram = InterfaceImplementor.extend({
	init: function(id,diagram)	{
		this._super();
		this.id = id;
		this.diagram = diagram;
	},
	
	implement: function(obj)	{
		this.bind(obj, new ExtractDiagramHandler(this.id, this.diagram));
	}
});

ExtractDiagramHandler = Handler.extend({
	init: function(id,diagram){
		this._super();
		this.id = id;
		this.diagram = diagram;
	},
	
	getEventName: function(){
		return "click";
	},
	
	onEvent: function(e,obj) {
		var diagramname = this.diagram.val(); 
		$("#dialog_div_"+this.id).remove();
		var objs = app.getObjectManager().getMainObjects();
		var url = 'services/load.php';
		url += '?name='+diagramname;
		while(objs.length > 0){
			objs[0].dispose();			
		}
		$.ajax({
			cache: false,
			type:'GET',
			url: url,
			beforeSend: function(){
				alertMsg("alert","<img src='images/wait.gif'/>");
			},
			complete: function (data){
				var strToLoad = data.responseText;
				var objsToLoad = $.parseJSON(strToLoad);
				var deserializer = new Deserializer();
				for(var i=0;i<objsToLoad.length;i++)	{
					var obj = objsToLoad[i];
					var deserializedObj = deserializer.deserialize(obj);
					app.getMainArea().addObject(deserializedObj);
					deserializedObj.afterLoad();
				}				
				alertMsg("alert","Completed !");
			}
		});
	}
});

CloseDialog = InterfaceImplementor.extend({
	init: function(id)	{
		this._super();
		this.id = id;
	},
	
	implement: function(obj)	{
		this.bind(obj, new CloseDialogHandler(this.id));
	}
});

CloseDialogHandler = Handler.extend({
	init: function(id)	{
		this._super();
		this.id = id;
	},

	getEventName: function ()	{
		return "click";
	},
	
	onEvent: function (e,obj)	{
		$("#dialog_div_"+this.id).remove();
	}
});

ClickToggleButton = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ClickToggleButtonHandler());
	}
});

ClickToggleButtonHandler = Handler.extend({
	getEventName: function()	{
		return "click";
	},
	
	onEvent: function(e,obj)	{
		obj.access().toggleClass("toggledown");
		if(obj.access().hasClass("toggledown")){
			obj.state = true;
		}else{
			obj.state = false;
		}
	}
});

TestToggle = InterfaceImplementor.extend({
	implement: function(obj)	{
		this.bind(obj, new ClickTestToggleHandler());
	}
});

ClickTestToggleHandler = Handler.extend({
	getEventName: function()	{
		return "click";
	},
	
	onEvent: function(e,obj)	{
		dialog("alert","fine: "+obj.state,null);
	}
});