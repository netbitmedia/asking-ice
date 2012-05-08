FeaturedNewsPortlet = Class.extend({
	init: function()	{
		this.name = "FeaturedNewsPortlet";
	},
	
	run: function()	{
		this.getPortletPlaceholder().drawToCanvas(this.render());
		this.fetch();
	},
	
	fetch: function() {
		var obj = this;
		this.onAjax('ajax','get-featured-news',{},'POST',{
			'onSuccess': function(ret){
				obj.requestForEffectiveResource('News').html(obj.renderView('NewsTmpl',{news:ret}));
			}
		});
	},
	
	onDynamicEditViewButtonClick: function(eventData)	{
		this.requestForEffectiveResource('News').find(".dynamic-edit-editable").hide();
	},
	
	onDynamicEditEditButtonClick: function(eventData)	{
		this.requestForEffectiveResource('News').find(".dynamic-edit-editable").show();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface);