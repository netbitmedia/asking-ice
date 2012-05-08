UnsubscribePortlet = Class.extend({
	init: function()	{
		this.name = "UnsubscribePortlet";
	},

	onBegin: function()	{
		this.model = {};
		this.registerObserver();
	},
	
	onEnd: function() {
		this.unregisterObserver();
	},
	
	onReloadPage: function() {
		this.run();
	},
	
	onConfirmUnsubscribe: function() {
		var obj = this;
		var email = this.getRequest().getParam('e');
		var code = this.getRequest().getParam('c');
		this.onAjax('ajax', 'unsubscribe', {email: email, code: code}, 'post', {
			onSuccess: function(ret)	{
				obj.requestForEffectiveResource('Container').html(obj.renderView('ConfirmSuccess', {}));
			},
			onFailure: function(msg)	{
				obj.requestForEffectiveResource('Error').html(msg);
			}
		});
	},
	
	onSendUnsubscribeCodeButtonClick: function() {
		var email = this.requestForEffectiveResource('Email').val();
		var obj = this;
		this.onAjax('ajax', 'send-unsubscribe-email', {email: email}, 'post', {
			onSuccess: function(ret)	{
				var subject = SingletonFactory.getInstance(Subject);
				subject.notifyEvent('RequestRoute', new Request('Home'));
				subject.notifyEvent('NotifyGlobal', 'Email xác nhận đã được gửi đến hòm mail của bạn');
			},
			onFailure: function(msg)	{
				obj.requestForEffectiveResource('Error').html(msg);
			}
		});
	},
	
	run: function()	{
		var obj = this;
		this.getPortletPlaceholder().paintCanvas(this.render());
		var email = this.getRequest().getParam('e');
		var code = this.getRequest().getParam('c');
		var d = this.getRequest().getParam('do');
		if (d == 'resend')	{
			this.requestForEffectiveResource('Container').html(this.renderView('SendMail', {}));
			return;
		}
		this.onAjax('ajax', 'is-unsubscribe-code-valid', {email: email, code: code}, 'post', {
			onSuccess: function(ret)	{
				obj.requestForEffectiveResource('Container').html(obj.renderView('Confirm', {email: email}));
			},
			onFailure: function(msg)	{
				obj.requestForEffectiveResource('Container').html(obj.renderView('ErrorToken', {}));
			}
		});
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);