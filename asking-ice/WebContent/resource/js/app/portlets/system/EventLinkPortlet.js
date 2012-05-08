EventLinkPortlet = Class.extend({
	init: function()	{
		this.name = "EventLinkPortlet";
	},
	
	onBegin: function()	{
		this.model = {};
	},

	run: function()	{
		this.getPortletPlaceholder().paintCanvas(this.render());
	}
}).implement(PortletInterface).implement(RenderInterface);