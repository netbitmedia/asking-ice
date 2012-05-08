InterestedAreaEditPortlet = InterestedAreaPortlet.extend({
	init: function()	{
		this.name = "InterestedAreaEditPortlet";
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface);