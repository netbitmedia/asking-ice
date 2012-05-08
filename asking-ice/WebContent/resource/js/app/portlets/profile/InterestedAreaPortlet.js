InterestedAreaPortlet = Class.extend({
	init: function()	{
		this.name = "InterestedAreaPortlet";
		this.useCache = true;
	},
	
	onBegin: function()	{
		this.model = {};
		this.registerObserver();
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	},
	
	onInterestedAreaChanged: function()	{
		this.useCache = false;
		this.run();
		this.useCache = true;
	},
	
	run: function()	{
		var root = SingletonFactory.getInstance(Application).getSystemProperties().get('host.root');
		var obj = this;
		var id = this.getRequest().getParam('id');
		this.onAjax('user-ajax', 'get-all-interests', {'id': id}, 'GET', 
				{'onSuccess': function(ret)	{
					var empty = true;
					for(var i in ret)	{
						empty = false;
						break;
					}
					obj.model.empty = empty;
					obj.model.interestContexts = ret;
					obj.getPortletPlaceholder().paintCanvas(obj.render());
				}}, this.useCache, 300000);
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);