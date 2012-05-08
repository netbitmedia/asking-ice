CleanStylePlugin = Class.extend({
	init: function()	{
		this.name = "CleanStylePlugin";
	},
	
	onCleanFont: function()	{
		$('.ans-content').find('[style]').each(function(index, value) {
			$(value).removeAttr('style');
		});
		
		$('.ans-content').find('font').each(function(index, value) {
			$(value).removeAttr('face');
			$(value).removeAttr('color');
		});
	}
}).implement(PluginInterface);