ContactsPortlet = Class.extend({
	init: function()	{
		this.name = "ContactsPortlet";
		this.page = 0;
	},
	
	onBegin: function()	{
		this.registerObserver();
	},
	
	run: function()	{
		this.fetchContacts();
	},
	
	onShowMoreMyContacts: function() {
		var obj = this;
		this.page++;
		this.onAjax('user-ajax', 'get-contacts', {page: this.page}, 'GET', {
			'onSuccess': function(ret)	{
				if (ret.length > 0)	{
					obj.requestForEffectiveResource('Container').append(obj.renderView('Contacts', {contacts: ret}));
				}
				if (ret.length < 20)	{
					obj.requestForEffectiveResource('ShowMore').hide();
				}
			}
		});
	},
	
	fetchContacts: function(){
		var obj = this;
		this.onAjax('user-ajax', 'get-contacts', {page: this.page}, 'GET', {
			'onSuccess': function(ret)	{
				obj.model = {};
				obj.model.contacts = ret;
				obj.getPortletPlaceholder().paintCanvas(obj.render());
				if (ret.length > 0)	{
					obj.requestForEffectiveResource('Container').html(obj.renderView('Contacts', {contacts: ret}));
				}
				if (ret.length < 20)	{
					obj.requestForEffectiveResource('ShowMore').hide();
				}
			}
		});
	},
	
	onSendInviteButtonClick: function(eventData)	{
		var email = eventData.email;
		var origin = eventData.origin.target;
		var plhd = $(origin).parent();
		plhd.html('<img class="invite-ajax-loader" src="resource/images/ajax-loader-1.gif">');
		this.onAjax('invitation', 'send-invitation', {'email': email}, 'POST', {
			'onSuccess': function()	{
				$(plhd).html('<strong class="InvitationSent">Đã gửi lời mời</strong>');
			},
			
			'onFailure': function()	{
				$(plhd).html('<div class="errorMsg">Gửi thất bại!</div>');
			}
		});
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);