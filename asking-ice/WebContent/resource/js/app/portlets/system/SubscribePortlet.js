SubscribePortlet = Class.extend({
	init: function()	{
		this.name = "SubscribePortlet";
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
	
	onSystemPropertyChanged: function(eventData)	{
		if (eventData == 'user.login')	{
			this.run();
		}
	},
	
	onSubscribeButtonClick: function() {
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
	
	run: function()	{
		var obj = this;
		var login = SingletonFactory.getInstance(Application).getSystemProperties().get('user.login');
		if (login == 1)	{
			this.onAjax('user-ajax', 'is-subscribe', {}, 'post', {
				onSuccess: function(ret)	{
					if (!ret)	{
						obj.getPortletPlaceholder().paintCanvas(obj.render());
					} else {
						obj.getPortletPlaceholder().paintCanvas("");
					}
				}
			});
		} else {
			this.getPortletPlaceholder().paintCanvas(this.render());
		}
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);