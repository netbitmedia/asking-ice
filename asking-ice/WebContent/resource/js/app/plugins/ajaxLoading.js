AjaxLoadingPlugin = Class.extend({
	init: function()	{
		this.name = "AjaxLoadingPlugin";
		this.ajaxCount = 0;
	},
	
	onAjaxBegan: function()	{
		this.ajaxCount ++;
		var id = '#effective-area #AjaxLoadIndicator';
		if ($(id).length == 0)	{
			$('#effective-area').append('<div id="AjaxLoadIndicator" class="ajax-load-indicator"><img src="resource/images/ajax-loader-1.gif" /></div>');
		}
		var w = 32;
		var h = 32;
		var left = (screen.width/2)-(w/2);
		var top = (screen.height/2)-(h/2);
		$(id).attr('style', 'position: fixed; left: '+left+'px; top: '+top+'px;');
		$(id).show();
	},
	
	onAjaxFinished: function()	{
		if (this.ajaxCount > 0)	{
			this.ajaxCount --;
		}
		if (this.ajaxCount == 0)	{
			var id = '#effective-area #AjaxLoadIndicator';
			$(id).hide();
		}
	}
}).implement(PluginInterface);