CommentPlugin = Class.extend({
	init : function() {
		this.name = "CommentPlugin";
		this.props = SingletonFactory.getInstance(Application).getSystemProperties();
		this.root = this.props.get("host.root");
	},
	
	onAnswerBuilt: function(evenData)	{
		var uid = this.props.get('user.login');
		var obj = this;
		if (uid != 0)	{
			$('.extension-point[extensionName="AnswerExtension"]').each(function()	{
				if ($(this).find('[flag="AnsComment"]').length > 0)	{
					return;
				}
				var aid = $(this).attr('aid');
				var uid = $(this).attr('uid');
				$(this).find('.ans-control .extension_place').append(tmpl('CommentPlugin-Control', {uid: uid, aid: aid}));
				$(this).find('.ans-extension-area').append(tmpl('CommentPlugin-Area', {uid: uid, aid: aid}));
				obj.onAjax('answer', 'get-no-comment', {aid: aid}, 'GET', {
					'onSuccess': function(ret)	{
						$('#CommentControl-'+uid+'-'+aid).html('Bàn luận thêm ('+ret+')');
					}
				});
			});
		}
	},

	onShowComment: function(eventData){
		var uid = eventData.uid;
		var aid = eventData.aid;
		
		var visible = true;
		var commentArea = $('.extension-point[extensionName="AnswerExtension"][aid="'+aid+'"] .ans-extension-area .comment-outer');
		if (!commentArea.is(':visible'))	{
			visible = false;
			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent('AnswerExtensionControlChanged');
		}
		commentArea.slideToggle();
		if (!visible)	{
			this.reloadComment(uid, aid);
		}
	},
	
	reloadComment: function(uid, aid, cache)	{
		if (cache == undefined)
			cache = true;
		var obj = this;
		var commentArea = $('.extension-point[extensionName="AnswerExtension"][aid="'+aid+'"] .ans-extension-area .comment-outer');
		$(commentArea).find('.comment-list').html('');
		var sbj = SingletonFactory.getInstance(Subject);
		this.onAjax('answer', 'get-all-comments', {aid:aid}, 'GET', {
			'onSuccess': function(ret){
				//fetch comment number
				obj.bindNumberOfComment(aid,uid,ret.length);
				
				// dump to list
				for(var key in ret){
					var objParam = {};
					objParam.content = ret[key]["content"];
					objParam.date = ret[key]["since"];
					objParam.uid = ret[key]["userId"];
					objParam.username = ret[key]["name"] ;
					objParam.avatar = ret[key]["avatar"];
					var template = tmpl("CommentPlugin-Item",objParam);
					$(commentArea).find('.comment-list').append(template);
				}
				var checkImg = {};
				checkImg.zone = $(commentArea).find('.comment-list');
				sbj.notifyEvent("RequestProfileImageCheck", checkImg);
			}
		}, cache, 300000);
	},
	
	bindNumberOfComment: function(aid, uid, data){
		$('#CommentControl-'+uid+'-'+aid).html("Bàn luận thêm ("+data+")");
	},
	
	onAddComment: function(eventData){
		var aid = eventData.aid;
		var uid = eventData.uid;
		var commentArea = $('.extension-point[extensionName="AnswerExtension"][aid="'+aid+'"] .ans-extension-area .comment-outer');
		var textarea = commentArea.find('.comment-content');
		var content = textarea.val().trim();
		if(content == "")
			return;
		var obj = this;
		this.onAjax('answer', 'add-new-comment', {aid:aid, content:content}, 'POST', {
			'onSuccess': function(ret){
				textarea.val("");
				obj.reloadComment(uid, aid, false);
			}
		});
	}
}).implement(PluginInterface).implement(AjaxInterface);

ImproveAnswerPlugin = Class.extend({
	init: function()	{
		this.name = "ImproveAnswerPlugin";
	},
	
	onSendImprovement: function(eventData)	{
		var id = eventData.id;
		var subject = SingletonFactory.getInstance(Subject);
		var type = $('#ImproveAnswerPlugin-Select option:selected').val();
		this.onAjax('answer', 'add-negative-comment', {id: id, type: type}, 'GET', {
			'onSuccess': function(ret)	{
				subject.notifyEvent('PopupRemove', {id: 'ImproveAnswerPlugin'});
				subject.notifyEvent('NotifyGlobal', 'Bạn đã gửi góp ý thành công!');
				$('#ImproveControl-'+id).remove();
			}
		});
	},
	
	onImproveControlClick: function(eventData)	{
		var aid = eventData.aid;
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('ShowPopup', {id: 'ImproveAnswerPlugin', title: 'Góp ý cho câu trả lời', content: tmpl('ImproveAnswerPlugin-Form', {aid: aid})});
	},
	
	onAnswerBuilt: function()	{
		var loggedin = SingletonFactory.getInstance(Application).getSystemProperties().get('user.login');
		if (loggedin == 0)
			return;
		var obj = this;
		var cuid = SingletonFactory.getInstance(Application).getSystemProperties().get('user.id');
		$('.extension-point[extensionName="AnswerExtension"]').each(function()	{
			if ($(this).find('[flag="ImproveAnswer"]').length > 0)	{
				return;
			}
			
			$(this).append('<span flag="ImproveAnswer"></span>');
			var aid = $(this).attr('aid');
			var uid = $(this).attr('uid');
			if (uid == cuid)
				return;
			var dom = this;
			obj.onAjax('answer', 'has-sent-negative-comment', {id: aid}, 'GET', {
				'onSuccess': function(ret)	{
					if (ret == 1)	{
						return;
					}
					$(dom).find('.ans-control .extension_place').append(tmpl("ImproveAnswerPluginTmpl", {aid: aid}));
				}
			});
		});
	}
}).implement(PluginInterface).implement(AjaxInterface);

ImproveQuestionPlugin = Class.extend({
	init: function()	{
		this.name = "ImproveQuestionPlugin";
	},
	
	onQuestionBuilt: function(eventData){
		var loggedin = SingletonFactory.getInstance(Application).getSystemProperties().get('user.login');
		if (loggedin == 0)
			return;
		var obj = this;
		var cuid = SingletonFactory.getInstance(Application).getSystemProperties().get('user.id');
		var qid = eventData.id;
		var uid = eventData.userID;
		$('.extension-point[extensionName="QuestionTask"]').each(function()	{
			if ($(this).find('[flag="ImproveQuestion"]').length > 0)	{
				return;
			}
			
			$(this).append('<span flag="ImproveQuestion"></span>');
			if (uid == cuid)
				return;
			var dom = this;
			obj.onAjax('question', 'has-sent-negative-comment', {id: qid}, 'GET', {
				'onSuccess': function(ret)	{
					if (ret == 1)	{
						return;
					}
					$(dom).prepend(tmpl("ImproveQuestionPluginTmpl", {qid: qid}));
				}
			});
		});
	},
	
	onSendQuestionImprovement: function(eventData)	{
		var id = eventData.id;
		var subject = SingletonFactory.getInstance(Subject);
		var type = $('#ImproveQuestionPlugin-Select option:selected').val();
		this.onAjax('question', 'add-negative-comment', {id: id, type: type}, 'GET', {
			'onSuccess': function(ret)	{
				subject.notifyEvent('PopupRemove', {id: 'ImproveQuestionPlugin'});
				subject.notifyEvent('NotifyGlobal', 'Bạn đã gửi góp ý thành công!');
				$('#ImproveQuestionControl-'+id).remove();
			}
		});
	},
	
	onImproveQuestionControlClick: function(eventData)	{
		var qid = eventData.qid;
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('ShowPopup', {id: 'ImproveQuestionPlugin', title: 'Góp ý cho câu hỏi', content: tmpl('ImproveQuestionPlugin-Form', {qid: qid})});
	}
}).implement(PluginInterface).implement(AjaxInterface);

QuestionCommentPlugin = Class.extend({
	init: function()	{
		this.name = "QuestionCommentPlugin";
	},
	
	onQuestionBuilt: function(eventData){
		var loggedin = SingletonFactory.getInstance(Application).getSystemProperties().get('user.login');
		if (loggedin == 0)
			return;
		var obj = this;
		var cuid = SingletonFactory.getInstance(Application).getSystemProperties().get('user.id');
		var qid = eventData.id;
		var uid = eventData.userID;
		$('.extension-point[extensionName="QuestionTask"]').each(function()	{
			if ($(this).find('[flag="QuestionComment"]').length > 0)	{
				return;
			}
			
			$(this).append('<span flag="QuestionComment"></span>');
			if (uid == cuid)
				return;
			var dom = this;
			obj.onAjax('question', 'get-no-comment', {id: qid}, 'GET', {
				'onSuccess': function(ret)	{
					$(dom).append(tmpl("QuestionCommentControlTmpl", {qid: qid, no_comment: ret}));
				}
			});
		});
	},
	
	onSendQuestionImprovement: function(eventData)	{
		var id = eventData.id;
		var subject = SingletonFactory.getInstance(Subject);
		var type = $('#ImproveQuestionPlugin-Select option:selected').val();
		this.onAjax('question', 'add-negative-comment', {id: id, type: type}, 'GET', {
			'onSuccess': function(ret)	{
				subject.notifyEvent('PopupRemove', {id: 'ImproveQuestionPlugin'});
				subject.notifyEvent('NotifyGlobal', 'Bạn đã gửi góp ý thành công!');
				$('#ImproveQuestionControl-'+id).remove();
			}
		});
	},
	
	onQuestionCommentControlClick: function(eventData)	{
		var visible = true;
		var commentArea = $('#QuestionCommentArea');
		if (!commentArea.is(':visible'))	{
			visible = false;
			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent('AnswerExtensionControlChanged');
		}
		commentArea.slideToggle();
		if (!visible)	{
			this.reloadComment(qid);
		}
	},
	
	reloadComment: function(uid, aid, cache)	{
		if (cache == undefined)
			cache = true;
		var obj = this;
		var commentArea = $('.extension-point[extensionName="AnswerExtension"][aid="'+aid+'"] .ans-extension-area .comment-outer');
		$(commentArea).find('.comment-list').html('');
		var sbj = SingletonFactory.getInstance(Subject);
		this.onAjax('answer', 'get-all-comments', {aid:aid}, 'GET', {
			'onSuccess': function(ret){
				//fetch comment number
				obj.bindNumberOfComment(aid,uid,ret.length);
				
				// dump to list
				for(var key in ret){
					var objParam = {};
					objParam.content = ret[key]["content"];
					objParam.date = ret[key]["since"];
					objParam.uid = ret[key]["userId"];
					objParam.username = ret[key]["name"] ;
					objParam.avatar = ret[key]["avatar"];
					var template = tmpl("CommentPlugin-Item",objParam);
					$(commentArea).find('.comment-list').append(template);
				}
				var checkImg = {};
				checkImg.zone = $(commentArea).find('.comment-list');
				sbj.notifyEvent("RequestProfileImageCheck", checkImg);
			}
		}, cache, 300000);
	}
}).implement(PluginInterface).implement(AjaxInterface);