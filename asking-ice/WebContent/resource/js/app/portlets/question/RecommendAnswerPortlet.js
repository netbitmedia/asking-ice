RecommendAnswerPortlet = Class.extend({
	init: function()	{
		this.name = "RecommendAnswerPortlet";
		this.usingFacebox = false;
	},
	
	onBegin: function()	{
		this.model = {};
		this.registerObserver();
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	},
	
	onReloadPage: function()	{
		this.run();
	},
	
	run: function()	{
		this.question_id = this.getRequest().getParam('qid');
		this.getPortletPlaceholder().paintCanvas(this.render());
		
		var obj = this;
		var subject = SingletonFactory.getInstance(Subject);
		this.selectedPeople = undefined;
		
		this.onAjax('question', 'get-forwarded-answerers', {qid: this.question_id}, 'GET', {
			onSuccess: function(ret)	{
				obj.requestForEffectiveResource('AddedContainer').html(obj.renderView('AddedTmpl', {list: ret}));
				subject.notifyEvent('RequestProfileImageCheck', {zone: obj.requestForEffectiveResource('AddedContainer')});
			}
		});
		
		subject.notifyEvent('AttachFocusDetection', {target: this.requestForEffectiveResource('AddPeopleInputBox'), defaultValue: 'Nhập tên của người muốn mời'});
		
		var addPeopleInputBox = this.requestForEffectiveResource("AddPeopleInputBox");
		var eventData = {};
		eventData.selectCallback = "TargetPeopleSelect";
		eventData.autocompleteObject = addPeopleInputBox;
		var solrRoot = SingletonFactory.getInstance(Application).getSystemProperties().get('host.solr');
		eventData.autocompleteSource = solrRoot+"/person/person?rows=5";
		eventData.type = "RecommendPerson";
		subject.notifyEvent('NeedAutocomplete', eventData);
	},
	
	onRecommendEmail: function() {
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('ShowPopup', {id: 'RecommendAnswer', title: 'Mời trả lời qua email', content: this.renderView('EmailRecommend', {})});
	},
	
	onTargetPeopleSelect: function(eventData)	{
		var ui = eventData.ui;
		var txt = ui.item.label;
		var value = ui.item.id;
		if (ui.item.type == 'email') {
			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent('RecommendEmail');
			return;
		}
		this.appendPeople({value: value, txt: txt});
	},
	
	appendPeople: function(obj)	{
		var txt = obj.txt;
		var value = obj.value;
		
		var topicContainer = this.requestForEffectiveResource("AddPeopleContainer");
		if (this.selectedPeople == undefined)
			this.selectedPeople = Array();
		if (this.selectedPeople.length >= 2)
			return;
		for(var i=0; i<this.selectedPeople.length;i++ ){
			if(this.selectedPeople[i] === value){
				return;
			}
		}
		var textToken = $("<span class='tokenContent'>"+txt+"</span>");
		this.selectedPeople.push(value);
		if (this.selectedPeople.length == 1)	{
			this.requestForEffectiveResource('SubmitButtonContainer').show();
		}
		
		// UI ONLY
		var obj = this;
		var selectedPeople = this.selectedPeople;
		var span = $("<span>").addClass("edit_tag").append(textToken);
		$("<span>").bind("click",function(event){
			for(var start=0; start<selectedPeople.length; start++ ){
				if(selectedPeople[start] === value){
					break;
				}
			}
			selectedPeople.splice(start, 1);
			$(event.target).parent().remove();
			if (selectedPeople.length == 0)	{
				obj.requestForEffectiveResource('SubmitButtonContainer').hide();
			}
		}).html(" x ").css("text-align","center").appendTo(span);
		topicContainer.append(span);
	},
		
	checkEmail: function(strEmail) {
		var atpos = strEmail.indexOf("@");
		var dotpos = strEmail.lastIndexOf(".");
		if (atpos<1 || dotpos<atpos+2 || dotpos+2>=strEmail.length){
		  	return false;
	 	}
	 	return true;
	},

	onRecommendAnswerButtonClick: function(eventData)	{
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('NeedLogin', {type: 'RecommendAnswerButtonClick', evtData: eventData});
	},
	
	onEmailRecommendButtonClick: function(eventData) {
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('NeedLogin', {type: 'EmailRecommendButtonClick', evtData: eventData});
	},
	
	onLoginSuccess: function(eventData)	{
		var obj = this;
		if (eventData.type == 'EmailRecommendButtonClick')	{
			$('#RecommendAnswerPortlet-Error').html("");
	 	   	if( this.checkEmail($("#RecommendAnswerPortlet-AddEmailInputBox").val()) ){
	 	   		var emailtarget = $("#RecommendAnswerPortlet-AddEmailInputBox").val();
	 	   		var msg = $("#RecommendAnswerPortlet-OptionalMsg").val();
	 	   		this.onAjax('question', 'add-recommend-email', {msg: msg, question_id: this.question_id, email: emailtarget}, 'POST', {
					'onSuccess': function(ret)	{
						var sbj = SingletonFactory.getInstance(Subject);
						sbj.notifyEvent("NotifyGlobal", "Bạn đã mời trả lời thành công");
						sbj.notifyEvent("PopupRemove", {id: 'RecommendAnswer'});
					},
					'onFailure': function(message)	{
						$('#RecommendAnswerPortlet-Error').html(message);
					}
				});//end onAjax
	 	   }else{
	 		  $('#RecommendAnswerPortlet-Error').html("Email không hợp lệ");
	 	   }//end if check email address
		} else if (eventData.type == 'RecommendAnswerButtonClick') {
			var selectedPeople = new Array();
			if (this.selectedPeople != undefined && this.selectedPeople.length > 0)	{
				for (var i=0; i<this.selectedPeople.length; i++){
					selectedPeople.push(this.selectedPeople[i]);
				}
			}//end 
			this.onAjax('question', 'forward-question', {'qid': this.question_id, 'target_id': selectedPeople.join(',')}, 'POST', 
				{'onSuccess': function(ret)	{
					obj.onReloadPage();
				},
				'onFailure': function(message)	{
					obj.requestForEffectiveResource("QuestionError").html(obj.getLocalizedText("AskError"));
				}
			});//end onAjax
		}//end if recommend user
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);