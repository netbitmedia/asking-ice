IntroducePortlet = Class.extend({
	init: function()	{
		this.name = "IntroducePortlet";
	},
	
	onBegin: function()	{
		this.model = {};
		this.registerObserver();
	},
	
	onSubscribeHomeButtonClick: function() {
		var obj = this;
		var email = this.requestForEffectiveResource('Email').val();
		this.onAjax('ajax', 'subscribe', {email: email}, 'post', {
			onSuccess: function(ret)	{
				obj.requestForEffectiveResource('Email').val('');
				var subject = SingletonFactory.getInstance(Subject);
				subject.notifyEvent('NotifyGlobal', 'Bạn đã đăng ký nhận tin thành công');
			},
			onFailure: function(msg)	{
				var subject = SingletonFactory.getInstance(Subject);
				subject.notifyEvent('NotifyError', msg);
			}
		});
	},
	
	onEnd: function() {
		this.unregisterObserver();
	},
	
	onLoginSuccess: function() {
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('RequestRoute', new Request('Home'));
	},

	run: function()	{
		this.model.login = SingletonFactory.getInstance(Application).getSystemProperties().get('user.login');
		this.getPortletPlaceholder().drawToCanvas(this.render());
	}
}).implement(PortletInterface).implement(RenderInterface).implement(ObserverInterface).implement(AjaxInterface);