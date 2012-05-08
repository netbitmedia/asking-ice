SmallTopicCreatePortlet = Class.extend({
	init : function() {
		this.name = "SmallTopicCreatePortlet";
	},
	
	onBegin: function() {
		this.registerObserver();
	},
	
	onEnd: function() {
		this.unregisterObserver();
	},
	
	onTopicNameFocus: function() {
		this.requestForEffectiveResource('DesContainer').show();
	},
	
	onAddNewTopic: function(){
		var obj = this;
		var topicName = this.requestForEffectiveResource('Name').val();
		var topicDes = this.requestForEffectiveResource('Des').val();
		var sbj = SingletonFactory.getInstance(Subject);
		this.onAjax('catchword', 'add-new-topic', {topicName: topicName, topicDes: topicDes}, 'post', {
			onSuccess: function(ret){
				sbj.notifyEvent("NotifyGlobal","Thêm thành công");
				obj.requestForEffectiveResource('Name').val('');
				obj.requestForEffectiveResource('Des').val('');
				obj.requestForEffectiveResource('DesContainer').hide();
				sbj.notifyEvent("NewTopicAdded", {'value': ret, 'txt':topicName});
			},
			onFailure: function(){
				sbj.notifyEvent("NotifyGlobal","Thêm thất bại");
			}
		});
	},
	
	run : function() {
		this.getPortletPlaceholder().paintCanvas(this.render());
	}	
}).implement(RenderInterface).implement(PortletInterface).implement(ObserverInterface).implement(AjaxInterface);