ContactPortlet = Class.extend({
	init: function()	{
		this.name = "ContactPortlet";
	},
	
	run: function()	{
		this.getPortletPlaceholder().drawToCanvas(this.render());
	}
}).implement(PortletInterface).implement(RenderInterface);