TopicCreatePortletStandalone = TopicCreatePortlet.extend({
	init: function()	{
		this._super();
		this.name = "TopicCreatePortletStandalone";
	},
	
	onShowTopicCreatePopup: function(eventData)	{
		this.commitCallback = eventData.commitcallback;
		this.callback = eventData.callback;
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('ShowPopup', {id: 'TopicCreatePortletStandalone', 'title': 'Thêm chủ đề mới', 'content': this.template.html()});
	},
	
	onCommitTopicSuccess: function(eventData)	{
		var subject = SingletonFactory.getInstance(Subject);
		var commitCb = this.commitCallback;
		var cb = this.callback;
		subject.notifyEvent(commitCb, eventData);
		if (this.done < this.numCount)
			return;
		subject.notifyEvent('PopupRemove', {id: 'TopicCreatePortletStandalone'});
		subject.notifyEvent(cb);
	}
}).implement(PortletInterface).implement(RenderInterface).implement(ObserverInterface);