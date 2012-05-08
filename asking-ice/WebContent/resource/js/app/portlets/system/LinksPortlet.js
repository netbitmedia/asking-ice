LinksPortlet = Class.extend({
	init: function()	{
		this.name = "LinksPortlet";
	},
	
	onBegin: function()	{
		this.model = {};
	},

	run: function()	{
		this.getPortletPlaceholder().drawToCanvas(this.render());
	}
}).implement(PortletInterface).implement(RenderInterface);