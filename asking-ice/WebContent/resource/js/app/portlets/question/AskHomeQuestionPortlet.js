AskHomeQuestionPortlet = Class.extend({
	init: function()	{
		this.name = "AskHomeQuestionPortlet";
	},
	
/*	onBegin: function()	{
		this.model = {};
		this.registerObserver();
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	},*/
	
	run: function() {
		this.getPortletPlaceholder().drawToCanvas(this.render());
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('AttachAutocompleteEngine', {type: 'question-only', target: this.requestForEffectiveResource('TextBox')});
	},
	
/*	onAskHomeTextBoxFocus: function(eventData)	{
		this.requestForEffectiveResource("Extended").show();
	},
	
	onAskHomeButtonClick: function(eventData)	{
		var question = this.requestForEffectiveResource("TextBox").val();
		var extended = this.requestForEffectiveResource("TextAreaExtended").val();
		var anonymous = this.requestForEffectiveResource("Anonymous").is(':checked') ? 1 : 0;
		
		if (question == undefined || question.trim() == '')	{
			this.requestForEffectiveResource('QuestionError1').html('Câu hỏi không được để trống');
			return;
		}
		
		var obj = this;
		obj.requestForEffectiveResource("QuestionInfo").html("");
		obj.requestForEffectiveResource("QuestionError").html("");
		obj.requestForEffectiveResource("QuestionError1").html("");
		
		this.onAjax('question', 'add', {'title': question, 'content': extended, anonymous: anonymous}, 'POST', 
			{'onSuccess': function(ret)	{
				var sbj = SingletonFactory.getInstance(Subject);
				sbj.notifyEvent("NotifyGlobal", obj.getLocalizedText("AskSuccess"));
				sbj.notifyEvent("RequestRoute", new Request('Question', null, {qid: ret}));
				
				obj.requestForEffectiveResource("TextBox").val('');
				obj.requestForEffectiveResource("TextAreaExtended").val('');
				obj.requestForEffectiveResource("Extended").hide();
			},
			'onFailure': function(message)	{
				obj.requestForEffectiveResource("QuestionError").html(message);
			}
		});
	}*/
}).implement(PortletInterface).implement(RenderInterface).implement(ObserverInterface).implement(AjaxInterface);