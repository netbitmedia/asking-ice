FeedbackPortlet = Class.extend({
	init: function()	{
		this.name = "FeedbackPortlet";
	},
	
	onBegin: function()	{
		this.model = {};
		this.registerObserver();
	},
	
	run: function()	{
		this.getPortletPlaceholder().drawToCanvas(this.render());
	},
	
	onFeedbackSubmit: function()	{
		var feedback = this.requestForEffectiveResource('TextInput').val().trim();
		if (feedback == "")	{
			var obj = this.requestForEffectiveResource('Error');
			$(obj).html('Bạn vui lòng nhập thông tin phản hồi vào ô phía trên');
			return;
		}
		var email = this.requestForEffectiveResource('Email').val().trim();
		var obj = this;
		this.onAjax('ajax', 'send-feedback', {'content': feedback, 'email': email}, 'POST', {
			'onSuccess': function(ret)	{
				var subject = SingletonFactory.getInstance(Subject);
				subject.notifyEvent('NotifyMessage', 'Cảm ơn bạn đã đóng góp cho hệ thống! Chúng tôi sẽ nghiên cứu phản hồi của bạn và cải thiện hệ thống cho phù hợp.');
				var request = new Request('Home');
				subject.notifyEvent('RequestRoute', request);
			},
			'onFailure': function(message)	{
				var error = obj.requestForEffectiveResource('Error');
				$(error).html(message);
			}
		});
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(ObserverInterface).implement(AjaxInterface);