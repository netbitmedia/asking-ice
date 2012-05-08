StaticContentShortPortlet = Class.extend({
	init:function() {
		this.name = "StaticContentShortPortlet";
		this.ids = new Array("AboutUsShort");
	},
	
	displayContent: function(){
		var request = this.getRequest();
		var container = SingletonFactory.getInstance(PortletContainer);
		var footer = container.getPortletMetaByName("FooterPortlet").portlet;
		var id = request.getParam("page");
		for( var i=0; i<this.ids.length; i++ ){
			var res = this.requestForEffectiveResource(this.ids[i]);
			if(res != undefined && ! res.hasClass("doNotDisplay")){
				res.addClass("doNotDisplay");
			}
		}
		this.requestForEffectiveResource(id).removeClass("doNotDisplay");
		footer.setActive(id);
	},
	
	onReloadPage: function(){
		this.displayContent();
	},
	
	run: function() {
		this.getPortletPlaceholder().drawToCanvas(this.render());
		this.displayContent();
	}
}).implement(RenderInterface).implement(PortletInterface);