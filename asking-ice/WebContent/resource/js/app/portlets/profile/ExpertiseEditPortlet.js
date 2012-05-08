ExpertiseEditPortlet = ExpertisePortlet.extend({
	init: function()	{
		this.name = "ExpertiseEditPortlet";
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface);