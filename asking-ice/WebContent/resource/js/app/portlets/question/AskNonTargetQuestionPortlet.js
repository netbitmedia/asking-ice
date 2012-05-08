AskQuestionPortlet = AskBasePortlet.extend({
	init: function()	{
		this.name = "AskQuestionPortlet";
		this.selectedTopics = new Array();
		this.usingFacebox = false;
	},
	
	onMakeNewQuestion: function(eventData)	{
		this.showPortlet(eventData);
	},

	onAskQuestionPortletFetchAutocomplete: function()	{
		this.fetchAutocomplete();
	},
	
	onAskQuestionPortletPeopleSelect: function(eventData)	{
		var ui = eventData.ui;
		var txt = ui.item.label;
		var value = ui.item.id;
		this.appendPeople({value: value, txt: txt});
	},
	
	onAskQuestionPortletTopicSelect: function(eventData)	{
		var ui = eventData.ui;
		var txt = ui.item.label;
		var value = ui.item.id;
		
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('AskNonTargetQuestionPortletAppend', {'txt': txt, 'value': value});
	},
	
	onAskNonTargetQuestionPortletAppend: function(eventData)	{
		this.append(eventData);
	},
	
	onAskNonTargetTextBoxFocus: function(eventData)	{
		this._requestForEffectiveResource("Extended").show();
	},
	
	onAskNonTargetButtonClick: function(eventData)	{
		var question = this._requestForEffectiveResource("TextBox").val();
		var extended = this._requestForEffectiveResource("TextAreaExtended").val();
		var anonymous = this._requestForEffectiveResource("Anonymous").is(':checked') ? 1 : 0;
		
		if (question == undefined || question.trim() == '')	{
			this._requestForEffectiveResource('QuestionError1').html('Câu hỏi không được để trống');
			return;
		}
		
		var obj = this;
		obj._requestForEffectiveResource("QuestionInfo").html("");
		obj._requestForEffectiveResource("QuestionError").html("");
		obj._requestForEffectiveResource("QuestionError1").html("");
		var selectedTopics = new Array();
		if(this.selectedTopics.length > 0){
			for( var i=0; i<this.selectedTopics.length; i++ ){
				selectedTopics.push(this.selectedTopics[i]); 
			}
		}
		var target_id = undefined;
		var target_next_id = undefined;
		if (this.selectedPeople != undefined && this.selectedPeople.length > 0)	{
			target_id = this.selectedPeople[0];
			if (this.selectedPeople.length > 1)	{
				target_next_id = this.selectedPeople[1];
			}
		}
		
		this.onAjax('question', 'add', {'title': question, 'content': extended, 'catch': selectedTopics.join(','), 'target_id': target_id, 'target_next_id': target_next_id, anonymous: anonymous}, 'POST', 
			{'onSuccess': function(ret)	{
				this.selectedTopics = Array();
				var sbj = SingletonFactory.getInstance(Subject);
				sbj.notifyEvent("NotifyGlobal", obj.getLocalizedText("AskSuccess"));
				sbj.notifyEvent("RequestRoute", new Request('Question', null, {qid: ret, rel: 'ask'}));
				sbj.notifyEvent("PopupRemove", {id: 'AskQuestionPortlet'});
			},
			'onFailure': function(message)	{
				obj._requestForEffectiveResource("QuestionError").html(message);
			}
		});
	}
}).implement(PortletInterface).implement(RenderInterface).implement(ObserverInterface).implement(AjaxInterface);