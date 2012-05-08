ArticleSummaryPortlet = Class.extend({
	init: function()	{
		this.name = "ArticleSummaryPortlet";
	},
	
	onReloadPage: function()	{
		this.run();
	},
	
	run: function()	{
		var id = this.getRequest().getParam('aid');
		this.getPortletPlaceholder().paintCanvas(this.render());
		var obj = this;
		this.onAjax('article', 'get-summary', {id: id}, 'GET', {
			'onSuccess': function(ret)	{
				obj.requestForEffectiveResource('ContentPlaceholder').html(obj.renderView('ContentTmpl', ret));
			}
		});
	}
}).implement(PortletInterface).implement(AjaxInterface).implement(RenderInterface);