OnlineSupportPortlet = Class.extend({
	init: function() {
		this.name = "OnlineSupportPortlet";
	},
	
	run: function() {
		this.getPortletPlaceholder().paintCanvas(this.render());
	}
}).implement(PortletInterface).implement(AjaxInterface).implement(RenderInterface);