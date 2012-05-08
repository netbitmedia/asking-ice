ScrollPlugin = Class.extend({
	init: function()	{
		this.name = "ScrollPlugin";
	},
	
	onHtmlRendered: function()	{
		$(window).scroll(function() {
			if ($(window).scrollTop() + $(window).height() == $(document).height())	{
				var subject = SingletonFactory.getInstance(Subject);
				subject.notifyEvent('GetMoreResultRows');
			}
		});
	},
	
	onEnd: function() {
		$(window).unbind('scroll');
	}
}).implement(PluginInterface);