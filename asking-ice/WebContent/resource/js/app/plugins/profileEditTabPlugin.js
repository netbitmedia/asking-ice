ProfileEditTabPlugin = Class.extend({
	init: function()	{
		this.name = "ProfileEditTabPlugin";
	},

	onRenderProfileEditTab: function(eventData)	{
		var placeholder = eventData.placeholder;
		var tabs = eventData.tabs;
		var obj = {};
		obj.tabs = tabs;
		var tabMeta = tmpl('TabsMeta', obj);
		$(placeholder).prepend(tabMeta);
		$(placeholder).tabs();
	}
}).implement(PluginInterface);