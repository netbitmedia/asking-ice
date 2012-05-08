FooterPortlet = Class.extend({
	init:function() {
		this.name = "FooterPortlet";
		this.ids = new Array("TermOfUse","Privacy","Tutorial","AboutUs");
		this.activeId = undefined; 
	},
	
	requestForResource: function(resourceName){
		var app = SingletonFactory.getInstance(Application);
		var rm = app.getResourceManager();
		return rm.requestForResource(this.name,resourceName);
	},
	
	onReloadPage: function()	{
		for( var i=0; i < this.ids.length; i++ ){
			if(this.requestForEffectiveResource(this.ids[i]) != undefined ){
				if(this.requestForEffectiveResource(this.ids[i]).hasClass("footeritem_active")){
					this.requestForEffectiveResource(this.ids[i]).removeClass("footeritem_active");
				}
			}
		}
	},
	
	setActive: function(id){
		this.activeId = id;
		for( var i=0; i < this.ids.length; i++ ){
			if(this.requestForEffectiveResource(this.ids[i]) != undefined ){
				if(this.requestForEffectiveResource(this.ids[i]).hasClass("footeritem_active")){
					this.requestForEffectiveResource(this.ids[i]).removeClass("footeritem_active");
				}
			}
		}
		if(this.requestForEffectiveResource(id) != undefined ){
			this.requestForEffectiveResource(id).addClass("footeritem_active");
		}
	},

	run: function() {
		this.getPortletPlaceholder().drawToCanvas(this.render());
		if(this.activeId != undefined){
			this.setActive(this.activeId);
		}
	}
}).implement(RenderInterface).implement(PortletInterface);