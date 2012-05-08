ExtraQuestionsPortlet = Class.extend({
	init: function() {
		this.name = "ExtraQuestionsPortlet";
	},
	
	onBegin: function() {
		this.registerObserver();
	},
	
	onQuestionNotificationFetched: function(maxId) {
		var obj = this;
		this.onAjax('question', 'get-latest-questions', {qid: maxId}, 'get', {
			onSuccess: function(ret) {
				obj.model = {list: ret};
				if (ret.length > 0)
					obj.getPortletPlaceholder().paintCanvas(obj.render());
			}
		}, true, 300000);
	},
	
	onEnd: function() {
		this.unregisterObserver();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);