AskBasePortlet = Class.extend({
	init: function()	{
		this.name = "AskBasePortlet";
		this.selectedTopics = new Array();
		this.usingFacebox = false;
	},
	
	_requestForEffectiveResource: function(targetName){
		if(this.usingFacebox){
			return $("#"+this.name+"-"+targetName);
		}else{
			return this.requestForEffectiveResource(targetName);
		}
	},
	
	showPortlet: function(eventData){
		var loggedIn = SingletonFactory.getInstance(Application).getSystemProperties().get('user.login');
		if (loggedIn != 1)	{
			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent("NeedLogin", {type: this.name, event: eventData});
		} else {
			this.doShowPortlet(eventData);
		}
	},
	
	onLoginSuccess: function(eventData)	{
		if (eventData.type != this.name)
			return;
		this.doShowPortlet(eventData.event);
	},
	
	doShowPortlet: function(eventData)	{
		var subject = SingletonFactory.getInstance(Subject);
		this.usingFacebox = true;
		this.selectedPeople = Array();
		this.selectedTopics = Array();

		this.model.askMsg = $("#"+this.name+"-TextAskMessage").html();
		if (eventData.question == undefined)
			eventData.question = "";
		this.model.question = eventData.question;
		subject.notifyEvent('ShowPopup', {id: this.name, title: 'Đặt câu hỏi', content: this.render()});
		this._requestForEffectiveResource('TextBox').focus();
		var target = this._requestForEffectiveResource('TextAreaExtended');
		subject.notifyEvent('ExpandTextArea', {target: target, min: 30, max: 200});
		
		var profile = eventData.profile;
		if (profile != undefined)	{
			for(var i=0;i<profile.length && i<2;i++)	{
				this.appendPeople({value: profile[i].id, txt: profile[i].name});
			}
		}
		
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent(this.name+'FetchAutocomplete');
	},
	
	fetchAutocomplete: function()	{
		var addTopicInputBox = this._requestForEffectiveResource("AddTopicInputBox"); 
		//FIXME: data should be loaded only once !addTopicInputBox
		var eventData = {};
		eventData.selectCallback = this.name+"TopicSelect";
		eventData.autocompleteObject = addTopicInputBox;
		var solrRoot = SingletonFactory.getInstance(Application).getSystemProperties().get('host.solr');
		eventData.autocompleteSource = solrRoot+"/autocomplete/catch";
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('NeedAutocomplete', eventData);
		
		var addPeopleInputBox = this._requestForEffectiveResource("AddPeopleInputBox");
		var eventData = {};
		eventData.selectCallback = this.name+"PeopleSelect";
		eventData.autocompleteObject = addPeopleInputBox;
		eventData.autocompleteSource = solrRoot+"/person/person";
		eventData.type = "person";
		subject.notifyEvent('NeedAutocomplete', eventData);
	},
	
	appendPeople: function(obj)	{
		var txt = obj.txt;
		var value = obj.value;
		
		var topicContainer = this._requestForEffectiveResource("AddPeopleContainer");
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
		
		// UI ONLY
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
		}).html(" x ").css("text-align","center").appendTo(span);
		topicContainer.append(span);
	},
	
	onBegin: function()	{
		this.model = {};
		this.registerObserver();
	},
	
	run: function()	{
		this.model.optionalMsg = this.getLocalizedText("OptionalMessage");
		this.model.optionalDetailMsg = this.getLocalizedText("OptionalDetailMessage");
		this.model.askMsg = this.getLocalizedText("AskMessage");
		this.model.question = "";
		this.getPortletPlaceholder().drawToCanvas(this.render());
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	},
	
	append: function(eventData)	{
		var txt = eventData.txt;
		var value = eventData.value;
		var topicContainer = this._requestForEffectiveResource("AddTopicContainer");
		if (this.selectedTopics == undefined)
			this.selectedTopics = Array();
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
	}	
}).implement(PortletInterface).implement(RenderInterface).implement(ObserverInterface).implement(AjaxInterface);