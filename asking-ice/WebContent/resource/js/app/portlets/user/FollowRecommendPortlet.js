FollowRecommendPortlet = Class.extend({
	init: function()	{
		this.name = "FollowRecommendPortlet";
	},
	
	onBegin: function()	{
		this.registerObserver();
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	},
	
	onFollowPerson: function(eventData) {
		var obj = this;
		this.onAjax('user-ajax', 'follow-user', {'uid': eventData.id}, 'POST', {
			'onSuccess': function(ret)	{
				obj.run();
			}
		});
	},
	
	run: function()	{
		var obj = this;
		this.onAjax('user-ajax', 'get-follow-recommend', {}, 'get', {
			onSuccess: function(ret) {
				obj.model = {list: ret};
				obj.getPortletPlaceholder().paintCanvas(obj.render());
			}
		});
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);