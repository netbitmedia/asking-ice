InviteLinkPortlet = Class.extend({
	init: function()	{
		this.name = "InviteLinkPortlet";
	},
	
	onBegin: function()	{
		this.registerObserver();
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	},
	
	onSendBriefInvitation: function(eventData) {
		var obj = this;
		var plhd = eventData.target;
		$(plhd).parent().html('<img class="invite-ajax-loader" src="resource/images/ajax-loader-1.gif">');
		this.onAjax('invitation', 'send-invitation', {'email': eventData.email}, 'POST', {
			'onSuccess': function()	{
				obj.run();
			}
		});
	},
	
	run: function()	{
		var obj = this;
		this.onAjax('user-ajax', 'fetch-contacts-to-invite', {}, 'get', {
			onSuccess: function(ret) {
				obj.getPortletPlaceholder().paintCanvas(obj.render());
				if (ret.length == 0)	{
					obj.requestForEffectiveResource('Container').html(obj.renderView('Link', {}));
				} else {
					var people = Array();
					for(var j=0;j<2;j++)	{
						var i = Math.floor(Math.random()*ret.length);
						people.push(ret[i]);
						ret.splice(i, 1);
					}
					obj.requestForEffectiveResource('Container').html(obj.renderView('People', {people: people}));
				}
			}
		});
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);