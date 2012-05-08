FancyboxPlugin = Class.extend({
	init: function()	{
		this.name = "FancyboxPlugin";
	},
	
	onHtmlUpdated: function()	{
		$('a.fancybox-link').each(function(index, value) {
			if ($(value).attr('fancybox') == '1')	{
				return;
			}
			$(value).attr('fancybox', '1');
			$(value).fancybox({
				'autoDimensions': true
				,'transitionIn': 'fade'
				,'transitionOut': 'elastic'
				,'speedIn': 200
				,'speedOut': 100
				,'overlayShow': true
				,'hideOnContentClick': true
				,'showCloseButton': true
				,'enableEscapeButton': true
				,'type': 'ajax'
			});
		});
	}
}).implement(PluginInterface);