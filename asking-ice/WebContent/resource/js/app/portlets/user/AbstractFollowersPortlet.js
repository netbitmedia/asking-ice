AbstractFollowersPortlet = Class.extend({
	init: function()	{
	},
	
	onBegin: function()	{
		this.registerObserver();
	},
	
	onReloadPage: function()	{
		this.fetchFollowerList();
	},
	
	run: function()	{
		this.fetchFollowerList();
	},
	
	fetchFollowerList: function(){
		var uid = this.getRequest().getParam(this.key);
		var obj = this;
		
		this.onAjax(this.controller, this.action, {'uid': uid}, 'GET', {
			'onSuccess': function(ret)	{
				obj.model = {};
				obj.model.list = ret;
				if (uid == undefined)
					obj.model.pronoun = "bạn";
				else
					obj.model.pronoun = "người này";
				obj.getPortletPlaceholder().paintCanvas(obj.render());
			}
		});
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);