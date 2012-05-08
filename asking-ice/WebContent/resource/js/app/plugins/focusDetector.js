FocusDetectorPlugin = Class.extend({
	init: function()	{
		this.name = "FocusDetectorPlugin";
	},
	
	onAttachFocusDetection: function(eventData)	{
		var target = eventData.target;
		var defaultValue = eventData.defaultValue;
		$(target).attr('placeholder', defaultValue);
	}
}).implement(PluginInterface);