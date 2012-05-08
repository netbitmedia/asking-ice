/**
 * @author DUNGBK
 */
PartnersPortlet = Class.extend({
	init: function()	{
		this.name = "PartnersPortlet";
	},
	
	onBegin: function()	{
		this.model = {};
	},

	run: function()	{
		this.getPortletPlaceholder().drawToCanvas(this.render());
	}
}).implement(PortletInterface).implement(RenderInterface);