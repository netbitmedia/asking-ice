LatestArticlesPortlet = FeaturedArticlesPortlet.extend({
	init: function()	{
		this.name = 'LatestArticlesPortlet';
		this.action = 'get-latest-articles';
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface);