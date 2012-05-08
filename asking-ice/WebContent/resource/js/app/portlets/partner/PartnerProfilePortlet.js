PartnerProfilePortlet = Class.extend({
	init: function()	{
		this.name = "PartnerProfilePortlet";
	},
	
	onBegin: function()	{
		this.model = {};
	},

	run: function()	{
		this.getPortletPlaceholder().drawToCanvas(this.render());
		this.fetch();
	},
	
	fetch: function()	{
		var obj = this;
		var id = this.getRequest().getParam('id');
		this.onAjax('ajax', 'get-profile-info', {'id': id}, 'GET', {
			'onSuccess': function(ret)	{
				obj.requestForEffectiveResource('HeaderInfo').html(obj.renderView('HeaderInfoTmpl', {partner: ret}));
			},
		});
	},
	
	onEnd: function()	{
	}

}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface);