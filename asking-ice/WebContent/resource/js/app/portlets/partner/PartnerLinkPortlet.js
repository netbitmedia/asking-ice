PartnerLinkPortlet = Class.extend({
	init: function()	{
		this.name = "PartnerLinkPortlet";
	},
	
	onBegin: function()	{
		this.model = {};
	},

	run: function()	{
		this.getPortletPlaceholder().drawToCanvas(this.render());
	}
}).implement(PortletInterface).implement(RenderInterface);