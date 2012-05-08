ArticleBrowserPortlet = Class.extend({
	init: function()	{
		this.name = "ArticleBrowserPortlet";
	},
	
	onBegin: function()	{
		this.registerObserver();
	},
	
	onTopMenuActive: function(name)	{
		if (name != this.name)	{
			$('#ArticleBrowserPortlet-ContentPlaceholder').html('');
			return;
		}
		var obj = this;
		this.onAjax('article', 'browse-articles', {}, 'GET', {
			'onSuccess': function(ret)	{
				obj.model = {};
				obj.model.articles = Array();
				for (var i in ret)	{
					obj.model.articles.push(ret[i]);
				}

				obj.getPortletPlaceholder().paintCanvas(obj.render());
				obj.requestForEffectiveResource('ContentPlaceholder').find('ul:first').addClass('first');
				obj.requestForEffectiveResource('ContentPlaceholder').find('ul:last').addClass('last');
			}
		}, true, 300000);
	},
	
	onReloadPage: function()	{
		this.checkActive();
	},
	
	run: function()	{
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);