TopicInterestAdderPlugin = Class.extend({
	init: function()	{
		this.name = "TopicInterestAdderPlugin";
	},
	
	onAddTopicToInterest: function(eventData)	{
		tid = SingletonFactory.getInstance(Page).getRequest().getParam('id');
		this.onAjax('user-ajax', 'add-single-interest', {id: tid}, 'POST', {
			'onSuccess': function()	{
				$(eventData.target).remove();
			}
		});
	},
	
	onHtmlUpdated: function()	{
		var obj = this;
		$('.extension-point[extensionName="TopicControl"]').each(function()	{
			if ($(this).find('[flag="TopicInterestAdder"]').length > 0)
				return;
			$(this).append('<span flag="TopicInterestAdder"></span>');
			//check login
			var props = SingletonFactory.getInstance(Application).getSystemProperties();
			var loggedIn = props.get('user.login');
			var dom = this;
			if (loggedIn == 1)	{
				tid = SingletonFactory.getInstance(Page).getRequest().getParam('id');
				obj.onAjax('catchword', 'user-has-interest', {'id': tid}, 'GET', {
					'onSuccess': function(ret)	{
						if (ret == 0)	{
							$(dom).append(tmpl('TopicInterestAdderTmpl', {}));
						}
					}
				});
			}
		});
	}
}).implement(PluginInterface).implement(AjaxInterface);