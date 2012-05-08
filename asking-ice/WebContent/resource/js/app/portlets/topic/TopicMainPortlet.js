TopicMainPortlet = Class.extend({
	init: function()	{
		this.name = "TopicMainPortlet";
	},
	
	onReloadPage: function()	{
		this.run();
	},
	
	run: function()	{
		var subject = SingletonFactory.getInstance(Subject);
		var id = this.getRequest().getParam('id');
		if (id == undefined || isNaN(id))	{
			subject.notifyEvent('RequestRoute', new Request('ErrorPage', undefined, {'code':404}));
			return;
		}
		var obj = this;
		obj.model = {};
		obj.model.id = id;
		obj.getPortletPlaceholder().paintCanvas(obj.render());
		this.onAjax('catchword', 'get-topic-details', {'id':id}, 'GET', {
			'onSuccess': function(ret)	{
				obj.requestForEffectiveResource('TopicName').html(ret.catchWord);
				obj.requestForEffectiveResource('TopicDetail').html(ret.detail);
				if (ret.avatar == undefined || ret.avatar == '')	{
					ret.avatar = 'asking.png';
				}
				obj.requestForEffectiveResource('TopicAvatar').attr('src', 'resource/images/topics/'+ret.avatar);
			},
			
			'onFailure': function(message)	{
				subject.notifyEvent('RequestRoute', new Request('ErrorPage', undefined, {'code':404}));
			}
		});
		
		this.onAjax('catchword', 'get-topic-stats', {'id':id}, 'GET', {
			'onSuccess': function(ret)	{
				obj.requestForEffectiveResource('ExpertCount').html(ret.expert);
				obj.requestForEffectiveResource('FollowCount').html(ret.follow);
				obj.requestForEffectiveResource('AnswerCount').html(ret.answer);
				obj.requestForEffectiveResource('QuestionCount').html(ret.question);
			}
		}, true, 300000);
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface);