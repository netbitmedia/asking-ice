AskSimilarQuestionPortlet = AskBasePortlet.extend({
	init: function()	{
		this.name = "AskSimilarQuestionPortlet";
		this.selectedTopics = new Array();
		this.usingFacebox = false;
		this.question_id=0;
	},
	
	onMakeNewSimilarQuestion: function(eventData)	{
		var qid=eventData.id;		
		this.question_id=qid;
		this.showPortlet(eventData);
		var obj = this;	
		var txt="";
		var val="";
		this.onAjax('question', 'get-all-catchwords-question', {'qid': qid}, 'GET', {'onSuccess': function(ret)	{
			for (var i=0;i<ret.length;i++)	{
				txt=ret[i].catchWord;
				val=ret[i].id;
				obj.AppendQuestionTopic({'txt':txt, 'value': val});
			}								
		}}, this.useCache, 300000);
	},
	
	onAskSimilarQuestionPortletFetchAutocomplete: function()	{
		this.fetchAutocomplete();
	},
	
	onAskSimilarQuestionPortletPeopleSelect: function(eventData)	{
		var ui = eventData.ui;
		var txt = ui.item.label;
		var value = ui.item.id;
		
		this.appendPeople({value: value, txt: txt});
	},
	
	onAskSimilarQuestionPortletTopicSelect: function(eventData)	{
		var ui = eventData.ui;
		var txt = ui.item.label;
		var value = ui.item.id;
		
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('AskSimilarQuestionPortletAppend', {'txt': txt, 'value': value});
	},

	AppendQuestionTopic: function(eventData)	{
		var txt = eventData.txt;
		var value = eventData.value;
		var topicContainer = this._requestForEffectiveResource("AddTopicContainer");
		for(var i=0; i<this.selectedTopics.length;i++ ){
			if(this.selectedTopics[i] === value){
				return;
			}
		}
		var textToken = $("<span class='tokenContent'>"+txt+"</span>");
		this.selectedTopics.push(value);
		
		// UI ONLY
		var selectedTopics = this.selectedTopics;
		var span = $("<span>").addClass("edit_tag").append(textToken);
		$("<span>").bind("click",function(event){
				var start = 0;
				for( start=0; start<selectedTopics.length; start++ ){
					if(selectedTopics[start] === value){
						break;
					}
				}
				selectedTopics.splice(start, 1);
				$(event.target).parent().remove();
			}).html(" x ").css("text-align","center").appendTo(span);
		topicContainer.append(span);
	},
		
	onAskSimilarQuestionPortletAppend: function(eventData)	{
		this.append(eventData);
	},
	
	onAskSimilarTextBoxFocus: function(eventData)	{
		this._requestForEffectiveResource("Extended").show();
	},
	
	onAskSimilarButtonClick: function(eventData)	{
		var question = this._requestForEffectiveResource("TextBox").val();
		var extended = this._requestForEffectiveResource("TextAreaExtended").val();
		
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
		var target_next_id = 0;
		if (this.selectedPeople != undefined && this.selectedPeople.length > 0)	{
			target_id = this.selectedPeople[0];
			if (this.selectedPeople.length > 1)	{
				target_next_id = this.selectedPeople[1];
			}
		}
		this.onAjax('question', 'add-similar-question', {'similarId':this.question_id,'title': question, 'content': extended, 'catch': selectedTopics.join(','), 'target_id': target_id, 'target_next_id': target_next_id}, 'POST', 
			{'onSuccess': function(ret)	{
				this.selectedTopics = Array();
				var sbj = SingletonFactory.getInstance(Subject);
				sbj.notifyEvent("NotifyGlobal", obj.getLocalizedText("AskSuccess"));
				sbj.notifyEvent("RequestRoute", new Request('Question', null, {qid: ret}));
				sbj.notifyEvent("PopupRemove", {id: 'AskSimilarQuestionPortlet'});
			},
			'onFailure': function(message)	{
				obj._requestForEffectiveResource("QuestionError").html(message);
			}
		});
	}
}).implement(PortletInterface).implement(RenderInterface).implement(ObserverInterface).implement(AjaxInterface);