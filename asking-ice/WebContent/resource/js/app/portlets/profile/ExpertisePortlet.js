ExpertisePortlet = Class.extend({
	init: function()	{
		this.name = "ExpertisePortlet";
	},
	
	onBegin: function()	{
		this.model = {};
		this.registerObserver();
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	},
	
	onReloadPage: function()	{
		this.run();
	},
	
	onExpertiseChanged: function()	{
		this.useCache = false;
		this.run();
		this.useCache = true;
	},
	
	run: function()	{
		var root = SingletonFactory.getInstance(Application).getSystemProperties().get('host.root');
		var obj = this;
		var id = this.getRequest().getParam('id');
		this.onAjax('user-ajax', 'get-all-expertises', {'id': id}, 'GET', 
			{'onSuccess': function(ret)	{
				var empty = true;
				for (var i in ret)	{
					empty = false;
					break;
				}
	
				obj.model.empty = empty;
				obj.model.expertiseContexts = ret;
				obj.getPortletPlaceholder().paintCanvas(obj.render());
			}}, this.useCache, 300000);
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);