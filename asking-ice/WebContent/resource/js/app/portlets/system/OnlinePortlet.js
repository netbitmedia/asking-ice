OnlinePortlet = Class.extend({
	init: function()	{
		this.name = "OnlinePortlet";
	},
	
	run: function()	{
		this.getPortletPlaceholder().paintCanvas(this.render());
		this.fetch();
	},
	
	fetch: function()	{
		var obj = this;
		this.onAjax('ajax', 'get-online-number', {}, 'GET', {
			'onSuccess': function(ret)	{
				obj.requestForEffectiveResource('OnlineTotal').html(ret);
			}
		});
		this.onAjax('ajax', 'who-online', {}, 'GET', {
			'onSuccess': function(ret)	{
				obj.requestForEffectiveResource('OnlineUsers').html(obj.renderView('UsersTmpl', {users: ret}));
			}
		});
	},
	
	onEnd: function()	{
	}
}).implement(PortletInterface).implement(AjaxInterface).implement(RenderInterface);