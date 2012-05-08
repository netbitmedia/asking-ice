FeaturedArticlesPortlet = Class.extend({
	init: function()	{
		this.name = 'FeaturedArticlesPortlet';
		this.action = 'get-most-voted-articles';
	},
	
	run: function()	{
		var obj = this;
		this.getPortletPlaceholder().paintCanvas(this.render());
		this.onAjax('ajax', this.action, {}, 'GET', {
			'onSuccess': function(ret) {
				for(var i in ret)	{
					var maxLength = 75;
					if (ret[i].summary != undefined)	{
						var trimmed = ret[i].summary.trim().substr(0, maxLength - 3);
						var lastWordIndex = trimmed.lastIndexOf(' ');
						if (lastWordIndex != -1)	{
							trimmed = trimmed.substr(0, lastWordIndex);
						}
						ret[i].summary = trimmed + "...";
					}
				}
				obj.requestForEffectiveResource('ContentPlaceholder').html(obj.renderView('FeaturedArticles', {articles: ret}));
			}
		});
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface);