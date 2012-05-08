/**
 * @author Hung
 */
ArticleListPortlet = Class.extend({
	init : function() {
		this.name = "ArticleListPortlet";
	},
	
	onReloadPage: function() {
		this.run();
	},
	
	run: function() {
		var obj = this;
		var compact = this.getInitParameters().compact;
		var t = this.getRequest().getParam('t');
		var pageSize = undefined;
		if (compact == 1)	{
			pageSize = 5;
		}
		this.onAjax('article', 'list-articles', {type: t, pageSize: pageSize}, 'GET', {
			onSuccess: function(ret) {
				obj.model = {};
				obj.model.list = ret;
				obj.getPortletPlaceholder().paintCanvas(obj.render());

				if (compact == 1)	{
					$('.simple_tab').remove();
					obj.requestForEffectiveResource('Info').remove();
				} else {
					$('.simple_tab a').removeClass('active');
					if (t == undefined)	{
						t = 0;
					}
					$('.simple_tab a[type='+t+']').addClass('active');
				}
			}
		});
	}
}).implement(RenderInterface).implement(PortletInterface).implement(AjaxInterface);