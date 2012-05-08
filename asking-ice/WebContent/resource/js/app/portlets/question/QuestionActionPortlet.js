QuestionActionPortlet = Class.extend({
	init: function()	{
		this.name = "QuestionActionPortlet";
	},
	
	onBegin: function()	{
		this.registerObserver();
	},
	
	onChangeBestSourceMark: function() {
		var subject = SingletonFactory.getInstance(Subject);
		var obj = this.requestForEffectiveResource('BestSourceBtn');
		var bs = obj.attr('bestSource');
		if (bs == 1)	{
			subject.notifyEvent('ShowPopup', {id: 'QuestionBestSource', title: 'Đánh dấu câu hỏi chất lượng', content: this.renderView('AddBestSource', {})});
		} else {
			subject.notifyEvent('ShowPopup', {id: 'QuestionBestSource', title: 'Bỏ đánh dấu câu hỏi chất lượng', content: this.renderView('RemoveBestSource', {})});
		}
	},
	
	onMarkBestSource: function() {
		var bestSource = $('#'+this.name+'-BestSourceReason').val();
		if (bestSource == "")	{
			$('#'+this.name+'-BestSourceError').val('Bạn phải nhập lý do');
			return;
		}
		var subject = SingletonFactory.getInstance(Subject);
		this.onAjax('question', 'mark-best-source', {id: this.questionID, reason: bestSource}, 'POST', {
			onSuccess: function(ret) {
				subject.notifyEvent('PopupRemove', {id: 'QuestionBestSource'});
				subject.notifyEvent('ReloadPage');
			}
		});
	},
	
	onRemoveBestSource: function() {
		var subject = SingletonFactory.getInstance(Subject);
		this.onAjax('question', 'remove-best-source', {id: this.questionID}, 'POST', {
			onSuccess: function(ret) {
				subject.notifyEvent('PopupRemove', {id: 'QuestionBestSource'});
				subject.notifyEvent('ReloadPage');
			}
		});
	},
	
	onChangeQuestionAnonymous: function() {
		var obj = this.requestForEffectiveResource('AnonymousBtn');
		this.onAjax('question', 'change-anonymous', {id: this.questionID, anonymous: obj.attr('anonymous')}, 'POST', {
			onSuccess: function(ret) {
				var subject = SingletonFactory.getInstance(Subject);
				subject.notifyEvent('ReloadPage');
			}
		});
	},
	
	onUnfollowQuestion: function(eventData)	{
		var id = eventData.id;
		var obj = this;
		this.onAjax('question', 'unfollow-question', {'id': id}, 'POST', {
			'onSuccess': function(ret)	{
				obj.requestForEffectiveResource('FollowBtn').html(tmpl('QuestionFollowTmpl-Follow', {id: id}));
				var subject = SingletonFactory.getInstance(Subject);
				subject.notifyEvent('QuestionFollowerChange');
			}
		});
	},
	
	onFollowQuestion: function(eventData)	{
		var id = eventData.id;
		var obj = this;
		this.onAjax('question', 'follow-question', {'id': id}, 'POST', {
			'onSuccess': function(ret)	{
				obj.requestForEffectiveResource('FollowBtn').html(tmpl('QuestionFollowTmpl-Unfollow', {id: id}));
				var subject = SingletonFactory.getInstance(Subject);
				subject.notifyEvent('QuestionFollowerChange');
			}
		});
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	},
	
	onAjaxQueryFetched: function(eventData) {
		var root = SingletonFactory.getInstance(Application).getSystemProperties().get('host.root');
		if (eventData.url == root+'/question/get-question-detail')	{
			this.model = eventData.result.data;
			this.questionID = this.model.qid = this.getRequest().getParam('qid');
			this.getPortletPlaceholder().paintCanvas(this.render());
			
			var props = SingletonFactory.getInstance(Application).getSystemProperties();
			var loggedin = props.get('user.login');
			if (loggedin == 0)
				return;
			
			var obj = this;
			this.onAjax('question', 'is-user-following', {'id': obj.questionID}, 'GET', {
				'onSuccess': function(ret)	{
					var follow = '';
					if (ret == true)	{
						follow = 'Unfollow';
					} else {
						follow = 'Follow';
					}
					obj.requestForEffectiveResource('FollowBtn').html(tmpl('QuestionFollowTmpl-'+follow, {id: obj.questionID}));
				}
			});
		}
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);